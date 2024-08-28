// Packages
import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import router from '../../router';
// Components
import Reports from '.';
// Helpers
import { APIError, callout } from '../../utils';

router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
    const [err, response] = await callout(Reports.find());
    if (err) {
        return next(new APIError(err.message, err.status, true));
    }
    res.json(response);
});

// Review GET route
router.get('/report/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = _.get(req.params, 'id');
    const [err, response] = await callout(Reports.findOne(id));
    if (err) {
        return next(new APIError(err.message, err.status, true));
    }
    res.json(response);
});


router.post('/report', async (req: Request, res: Response, next: NextFunction) => {
    const token = _.get(req.headers, 'authorization') as string;
    const { title, content } = _.pick(req.body, 'title', 'content');
    const [err, response] = await callout(Reports.generateReport({ title, content }, token));
    if (err) {
        return next(new APIError(err.message, err.status, true));
    }
    res.json(response);
});

router.put('/report', async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = _.pick(req.body, 'title', 'content');
    const [err, response] = await callout(Reports.update({ title, content }));
    if (err) {
        return next(new APIError(err.message, err.status, true));
    }
    res.json(response);
});

router.delete('/report/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = _.get(req.params, 'id');
    const [err, response] = await callout(Reports.delete(id));
    if (err) {
        return next(new APIError(err.message, err.status, true));
    }
    res.json(response);
});

// Export router
export default router;
