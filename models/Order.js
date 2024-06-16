// models/Order.js
const pool = require('../config/db');

const createOrder = async (order) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            `INSERT INTO \`order\` (user_name, email, phone_number, address, city, state, zip_code, order_date, total_price)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [order.user_name, order.email, order.phone_number, order.address, order.city, order.state, order.zip_code, order.order_date, order.total_price]
        );

        const orderId = result.insertId;

        const orderDetailsPromises = order.items.map(item => {
            return connection.query(
                `INSERT INTO orderDetails (order_id, product_id, quantity, subtotal_price)
                 VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.subtotal_price]
            );
        });

        await Promise.all(orderDetailsPromises);

        await connection.commit();

        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
};
