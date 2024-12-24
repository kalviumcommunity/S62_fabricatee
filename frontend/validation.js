export const Validate = {
    validateName: (name)=> {
        const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,49}$/;
        if(name.length<2){
            return "Name cannot be less than 2 letters";
        }
        if(nameRegex.test(name)=="false"){
            return "name should name have any symbols";
        }
        return true;
    },
    validatePass: (pwd)=>{
        const passwordRegex = {
            minLength: 8,
            maxLength: 128,
            hasUpperCase: /[A-Z]/,
            hasLowerCase: /[a-z]/,
            hasNumbers: /[0-9]/,
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
        };
        if(pwd.length > passwordRegex.maxLength){
            return `password should be less then ${passwordRegex.maxLength} characters`;
        }
        if(pwd.length < passwordRegex.minLength){
            return `password should be greater then ${passwordRegex.minLength} characters`;
        }
        if(!passwordRegex.hasLowerCase.test(pwd)){
            return 'Password should have lowercase characters a-z';
        }
        if(!passwordRegex.hasUpperCase.test(pwd)){
            return 'Password should have uppercase characters a-z';
        }
        if(!passwordRegex.hasSpecialChar.test(pwd)){
            return 'Password should have uppercase characters a-z';
        }
        return true;
    },
    validateEmail: (email)=>{
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(email.length>256){
            return "Email is too long";
        }
        if(!emailRegex.test(email)){
            return "Enter a valid email";
        }
        return true;
    },
}





