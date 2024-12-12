const jwt=require('jsonwebtoken')
const JWT_SECRET = 'itsNotAtoken';

function authMiddleware(req,res,next){
    
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log("token not matched");
      
        return res.status(401).json({ message: 'No token, authorization denied' });
      }
      const token = authHeader.replace('Bearer ', '');
      try {
        console.log("token matched");
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        
        next();
      } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
      }
}

module.exports = authMiddleware;  