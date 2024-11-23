const UserController = require('./controllers/userController');
const userController = new UserController();
const userValidation = require('./middlewares/userValidation');


const getRequestBody = req => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        })
        req.on('end', () => {
            resolve(body.toString());
        })
        req.on('error', err => {
            reject(err);
        });
    })
}
const routesMap = {
    'POST:/api/users': async (req) => {
        const body = await getRequestBody(req);
        userValidation.validationToAdd(JSON.parse(body));
    },
    'DELETE:/api/users': async (req) => {
        const body = await getRequestBody(req);
        userValidation.validationToDelete(JSON.parse(body));
    },
    'GET:/api/users': async (req) => {
        userController.getAllUsers()
            .then(result => console.log(result))
            .catch(error =>  new Error(error));
    },
    'PUT:/api/users': async (req) => {
        const body = await getRequestBody(req);
        userValidation.validationToUpdate(JSON.parse(body));
    },
}

// manage the dynamic routes
const dynamicRoutes = {
    'GET:/api/user/': async (userId) => {
        await userController.getUserById(userId);
    }
};

// main function to manage the routes
const routes = (req, res) => {
    userController.initialize(req, res);
    const key = `${req.method}:${req.url.split('?')[0]}`;

    // Check static routes
    if (routesMap[key]) {
        routesMap[key](req);
    }
    //   Check dynamic routes
    else if (req.url.startsWith('/api/user/') && req.method === 'GET') {
        const userId = req.url.split('/api/user/')[1];
        dynamicRoutes['GET:/api/user/'](userId);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
};

module.exports = routes;