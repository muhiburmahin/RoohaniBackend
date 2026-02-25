const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
            });
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default validateRequest;
