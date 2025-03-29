class ApiResponse <T> {
    public statusCode: number;
    public message: string;
    public data: T 
    constructor(statusCode: number,message: string , data: T){
        this.statusCode = statusCode;
        this.message = message;
        this.data = data
    }
}

export default ApiResponse;