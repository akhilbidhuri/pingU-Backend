const maincontroller = require('../controller/index')
const usercontroller = require('../controller/users')

module.exports = (app) =>{
    app.use('/', maincontroller);
    app.use('/regcomp', maincontroller);
    app.use('/login', maincontroller);
    app.use('/reguser', maincontroller);
    app.use('/connect', maincontroller);
    app.use('/team', maincontroller);
    app.use('/users', usercontroller);
}