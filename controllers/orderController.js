const db = require('../config/db');

exports.createOrder = (req, res) => {
  const { user_name, email, phone_number, address, city, state, zip_code, total_price, items } = req.body;

  const orderQuery = `
    INSERT INTO \`order\` (user_name, email, phone_number, address, city, state, zip_code, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(orderQuery, [user_name, email, phone_number, address, city, state, zip_code, total_price], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      res.status(500).json({ message: 'Database error', error: err });
      return;
    }

    const orderId = result.insertId;
    const orderDetailsQuery = `
      INSERT INTO orderdetails (order_id, product_id, name, quantity, subtotal_price)
      VALUES ?
    `;

    const orderDetailsValues = items.map(item => [orderId, item.product_id, item.name, item.quantity, item.subtotal_price]);

    db.query(orderDetailsQuery, [orderDetailsValues], (err) => {
      if (err) {
        console.error('Error inserting order details:', err);
        res.status(500).json({ message: 'Database error', error: err });
        return;
      }

      res.status(201).json({ orderId });
    });
  });
};
