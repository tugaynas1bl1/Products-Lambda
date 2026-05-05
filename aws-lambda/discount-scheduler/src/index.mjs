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
            UPDATE dbo.Products
            SET  
                IsDiscountActive = CASE  
                    WHEN DiscountStart IS NOT NULL  
                     AND DiscountEnd IS NOT NULL  
                     AND GETDATE() BETWEEN DiscountStart AND DiscountEnd  
                    THEN 1
                    ELSE 0
                END;

            UPDATE dbo.Products
            SET  
                discountPrice = CASE  
                    WHEN IsDiscountActive = 1 THEN Price * 0.7
                    ELSE Price
                END;

            SELECT @@ROWCOUNT AS affectedRows;
        `);

        const affectedRows = result.recordset[0].affectedRows;

        console.log("Updated rows:", affectedRows);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Discount updated using IsDiscountActive correctly",
                updated: affectedRows,
            }),
        };

    } catch (err) {
        console.error("ERROR:", err);

        return {
            statusCode: 500,
            body: JSON.stringify(err.message),
        };

    } finally {
        await sql.close();
    }
};
