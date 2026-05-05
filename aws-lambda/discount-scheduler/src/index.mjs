import sql from "mssql";

export const handler = async () => {
    const config = {
        user: "admin",
        password: "Products123",
        server: "database-products.cq5y8g80cilv.us-east-1.rds.amazonaws.com",
        port: 1433,
        database: "database-products",
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
    };

    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT * FROM dbo.Products
        `);

        const now = new Date();

        for (let p of result.recordset) {
            let discountPrice = null;

            const isActive =
                p.IsDiscountActive &&
                p.DiscountStart &&
                p.DiscountEnd &&
                now >= new Date(p.DiscountStart) &&
                now <= new Date(p.DiscountEnd);

            if (isActive) {
                discountPrice = Number(p.Price) * 0.7;
            }

            await sql.query`
                UPDATE dbo.Products
                SET discountPrice = ${discountPrice}
                WHERE Id = ${p.Id}
            `;

            console.log(`Updated ID ${p.Id} => ${discountPrice}`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify("Discount updated successfully"),
        };
    } catch (err) {
        console.error("ERROR:", err);
        return {
            statusCode: 500,
            body: JSON.stringify(err.message),
        };
    }
};
