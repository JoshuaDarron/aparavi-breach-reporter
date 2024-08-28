// Packages
import path from 'path';
import fs from 'fs';
// Router
import router from './';

function getDirectories (path: string) {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(file => file.isDirectory()).map(dir => dir.name);
}

const basePath = path.join(__dirname, '../components');
getDirectories(basePath).forEach(componentName => {
    const routesPath = `${basePath}/${componentName}/routes.js`;
    if (fs.existsSync(routesPath)) import(routesPath);
})
/** Handle healthcheck */
router.get('/', (req, res, next) => {
    res.status(200).send(`
        <html>
            <head>
                <title>Healthcheck</title>
            </head>
            <body>
                <p>OK</p>
            </body>
        </html>
    `);
})
/** Export API routes */
export default router;