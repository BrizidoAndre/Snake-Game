export async function get( body){
    const res = await fetch(`http://localhost:3000/usuarios?username=${body.username}&password=${body.password}` )

    return res;
}