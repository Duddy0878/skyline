
// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

export async function fetchApi(api) {
    try {

        const res = await fetch(api);
        
        if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function fetchApiWithId(api, id) {
    try {

        const res = await fetch(`${api}${id}`);
        
        if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function postApi(api, data) {
    try {

        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    
        
        if (!res.ok) throw new Error(`Failed to post: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}


    export async function patchApi (api, id, data){

              try {
                 const res = await fetch(`${api}${id}`, {
                   method: 'PATCH',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(data)
                 })
                 if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to patch to ${api}: ${res.status} ${text}`);
                 }
                }
                    catch (err) {
                                      console.error(err);
                                        throw err;
                    }
                }