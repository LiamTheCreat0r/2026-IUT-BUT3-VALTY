// Translated from Models/{Product,Price,Notification,Supplier,Warehouse}.cs
//
// The C# version kept two representations of the same data in sync by hand:
// domain fields marked [NotMapped] (Price, Discounts, Images, SuppliersRegions,
// Warehouse) plus flattened EF columns (PriceAmount/DiscountsCsv/ImagesJson/...),
// reconciled via SyncEfColumns()/HydrateFromEfColumns(). Prisma maps Decimal,
// String[] and Json columns natively (see schema.prisma), so that flattening
// and the two sync methods are gone: PrismaClient reads/writes plain objects
// and there is exactly one representation of each field.

import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type Chnl = "email" | "sms" | "push";
export type PrdStat = "active" | "out_of_stock" | "deprecated";

export interface Notification {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    channel: Chnl;
    sentAt: Date;
    productId?: string;
}

export class Supplier {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public region: string,
    ) { }
}

export class Warehouse {
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public region: string,
    ) { }
}

export class Price {
    amount: number;
    currency: string;
    margin: number; // percentage
    vat: number; // percentage, applied on margin only

    constructor(amount: number, currency: string) {
        this.amount = amount;
        this.currency = currency;
        this.margin = 15;
        this.vat = 20;
    }

    getResellerPrice(): number {
        const marginamount = (this.amount * this.margin) / 100;
        const vatamount = (marginamount * this.vat) / 100;
        return this.amount + marginamount + vatamount;
    }

    getamount(): number {
        return this.amount;
    }

    setamount(amount: number): void {
        this.amount = amount;
    }

    getcurrency(): string {
        return this.currency;
    }

    setcurrency(currency: string): void {
        this.currency = currency;
    }

    getmargin(): number {
        return this.margin;
    }

    setmargin(margin: number): void {
        this.margin = margin;
    }
}

export class Product {
    id: string;
    name: string;
    slug: string;
    price: Price;
    discounts: string[];
    images: Record<string, string>; // key = context ("thumbnail", "hero", ...), value = url
    suppliersRegions: Map<string, Supplier>; // key = region
    weight: number;
    dimensions: string;
    quantity: number;
    stock: number;
    warehouse: Warehouse | null;
    status: PrdStat;
    createdAt: Date;
    updatedAt: Date;
    notifications: Notification[] = [];
    validUntil: Date | null = null;
    nextStat: PrdStat | undefined;
    dscSnapshot: string[] | undefined;

    constructor(
        id: string,
        name: string,
        slug: string,
        price: Price,
        discounts: string[],
        images: Record<string, string>,
        suppliersRegions: Map<string, Supplier>,
        weight: number,
        dimensions: string,
        quantity: number,
        stock: number,
        warehouse: Warehouse | null,
    ) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.price = price;
        this.discounts = discounts;
        this.images = images;
        this.suppliersRegions = suppliersRegions;
        this.weight = weight;
        this.dimensions = dimensions;
        this.quantity = quantity;
        this.stock = stock;
        this.warehouse = warehouse;
        this.status = "active";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    getDisplayLabel(): string {
        //Déterminer le label du produit à afficher à côté de son nom
        let label: string;
        //Si le produit n'est plus en vente, on indique son nom et le fait qu'il n'est plus en circulation
        if (this.status === "deprecated") {
            label = `[DISCONTINUED] ${this.name}`;
        }
        //Sinon si le produit n'est plus en stock, on indique son nom et le fait qu'il est hors stock
        else if (this.stock === 0) {
            label = `[OUT OF STOCK] ${this.name}`;
        } else {
            //si le produit est disponible, on affiche juste son nom 
            label = this.name;
        }
        return label;
    }

    // --- Catalog / images / discounts ---

    async addImage(
        context: string,
        url: string,
        overwrite: boolean = true,
    ): Promise<void> {
        if (!url) {
            throw new Error("missing url");
        }

        if (url.substring(0, 4) !== "http") {
            throw new Error("url must start with http");
        }

        let key = context;

        if (this.images[context] !== undefined) {
            key = this.getImageKey(context);
        }

        this.images[key] = url;
        this.updatedAt = new Date();

        await prisma.product.update({
            where: { id: this.id },
            data: {
                images: this.images as Prisma.InputJsonValue,
                updatedAt: this.updatedAt,
            },
        });
    }

    private getImageKey(context: string): string {
        let key = context;

        for (const [, supplier] of this.suppliersRegions) {
            if (!supplier.region) {
                key = this.warehouse
                    ? `${context}-${this.warehouse.name}`
                    : context;
                continue;
            }

            if (!supplier.email) {
                key = `${context}-supplier`;
                continue;
            }

            const atIndex = supplier.email.indexOf("@");
            const dotIndex = supplier.email.indexOf(".", atIndex);

            if (atIndex > 0 && dotIndex > atIndex) {
                key = `${context}-${supplier.name}`;
                continue;
            }

            throw new Error(
                `Supplier ${supplier.name} has a malformed email: ${supplier.email}`,
            );
        }

        return key;
    }

    getValidUntil(): Date | null {
        return this.validUntil;
    }

    setValidUntil(validUntil: Date | null): void {
        this.validUntil = validUntil;
    }

    async addDiscount(dscCode: string, validUntil: Date): Promise<void> {
    //Vérifier que la liste des réductions existe
    if (this.discounts) {
        //Vérifier que le code de réduction et la date de validité sont renseignés
        if (dscCode && validUntil) {
            //Refuser la réduction si sa date de validité est déjà passée
            if (validUntil < new Date()) {
                throw new Error("validUntil cannot be in the past");
            }

            //Refuser l'ajout si le produit possède déjà deux réductions
            if (this.discounts.length >= 2) {
                throw new Error(
                    "Cannot have more than 2 discounts at the same time",
                );
            }

            //Ajouter le code de réduction à la liste des réductions
            this.discounts.push(dscCode);

            //Mettre à jour la date de validité des réductions
            this.setValidUntil(validUntil);

            //Enregistrer la date de dernière mise à jour du produit
            this.updatedAt = new Date();

            //Mettre à jour les réductions et la date de modification en base de données
            await prisma.product.update({
                where: { id: this.id },
                data: {
                    discounts: this.discounts,
                    updatedAt: this.updatedAt,
                },
            });
        }
    }
}


    // --- Suppliers ---

    async addSupplierToRegion(
        region: string,
        splrs: Supplier[],
    ): Promise<void> {
        const s = splrs.find((x) => x.region === region);
        if (!s) throw new Error(`No supplier found for region ${region}`);

        this.suppliersRegions.set(region, s);
        this.updatedAt = new Date();

        await prisma.productSupplier.upsert({
            where: { productId_region: { productId: this.id, region: region } },
            create: { productId: this.id, region: region, supplierId: s.id },
            update: { supplierId: s.id },
        });
    }

    // --- Pricing ---

    getResellerPrice(): number {
        const marginamount = (this.price.amount * this.price.margin) / 100;
        const vatamount = (marginamount * this.price.vat) / 100;
        return this.price.amount + marginamount + vatamount;
    }

    async setMargin(marginPct: number): Promise<void> {
        this.price.margin = marginPct;
        this.updatedAt = new Date();
        await prisma.product.update({
            where: { id: this.id },
            data: { priceMargin: marginPct, updatedAt: this.updatedAt },
        });
    }

    // --- Stock ---

    async receiveStock(quantity: number): Promise<void> {
        this.stock += quantity;
        this.quantity += quantity;
        this.updatedAt = new Date();
        console.log(`Restocking ${this.name} at ${this.warehouse!.name}`);
        await prisma.product.update({
            where: { id: this.id },
            data: {
                stock: this.stock,
                quantity: this.quantity,
                updatedAt: this.updatedAt,
            },
        });
    }

    async sell(quantity: number): Promise<void> {
        if (this.stock < quantity) throw new Error("Not enough stock");

        this.stock -= quantity;
        this.updatedAt = new Date();

        if (this.stock === 0) {
            this.nextStat = "out_of_stock";
            this.status = this.nextStat as PrdStat;
        }

        await prisma.product.update({
            where: { id: this.id },
            data: {
                stock: this.stock,
                status: this.status,
                updatedAt: this.updatedAt,
            },
        });

        // Notify all regional suppliers
        for (const [region, s] of this.suppliersRegions) {
            this.notifications.push(
                this.mkNotif(
                    s.email,
                    `Product sold: ${this.name}`,
                    `${quantity} unit(s) of ${this.name} were sold. Remaining stock: ${this.stock}.`,
                ),
            );
        }
    }

    // --- Lifecycle ---

    async deprecate(): Promise<void> {
        this.status = "deprecated";
        this.stock = 0;
        this.updatedAt = new Date();

        await prisma.product.update({
            where: { id: this.id },
            data: {
                status: this.status,
                stock: this.stock,
                updatedAt: this.updatedAt,
            },
        });

        // Notify all regional suppliers
        for (const [, s] of this.suppliersRegions) {
            this.notifications.push(
                this.mkNotif(
                    s.email,
                    `Product deprecated: ${this.name}`,
                    `The product ${this.name} has been deprecated and removed from the catalog.`,
                ),
            );
        }

        // Notify customers
        this.notifications.push(
            this.mkNotif(
                "customers@omniproduct.com",
                `Product no longer available: ${this.name}`,
                `${this.name} is no longer available.`,
            ),
        );
    }

    // small helper to cut down repetition in notif building
    private mkNotif(rcp: string, subject: string, bd: string): Notification {
        return {
            id: crypto.randomUUID(),
            recipient: rcp,
            subject: subject,
            body: bd,
            channel: "email",
            sentAt: new Date(),
            productId: this.id,
        };
    }
}
