export default async function handler( { url, method, jsonBody } ) {
    try {
        const response = await fetch(url, {
            method: method,
            mode: 'same-origin',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'same-origin',
            body: jsonBody,
          })
        return await response.json();
    } catch(e){
        console.log('Error during fetch:', e)
    } 
}