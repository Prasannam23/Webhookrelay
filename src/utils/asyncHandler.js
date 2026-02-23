export const asyncHandler = (fn) => (req,res,next) =>{
    promise.resolve(fn(req,res,nexxt)).catch(next)
}