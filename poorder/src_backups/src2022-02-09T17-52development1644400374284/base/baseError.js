class BusinessError extends Error{
    constructor(message){
        super(message);
    }
    isShow=true;
}
export default BusinessError