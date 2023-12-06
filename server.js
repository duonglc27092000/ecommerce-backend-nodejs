const app = require('./src/app');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with Port: ${PORT}`);
});
//duongh399
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Exit server Express')
    });
})