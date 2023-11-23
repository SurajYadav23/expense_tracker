async function signup(e) {
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const signupDetails = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value

        }
        console.log(signupDetails)
        const response  = await axios.post('http://13.233.251.79:5000/api/v1/users/signup',signupDetails)
            if(response.status === 201){
                window.location.href = "../Login/login.html" 
            } else {
                throw new Error('Failed to login')
            }
            
    }catch(err){
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
        console.log(err);
    }
}