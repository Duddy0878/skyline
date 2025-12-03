   export async function fetchApi (api){
            
            try {
               const res = await fetch(api);
                if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
                return await res.json();
            } catch (err) {
                console.error(err);
                throw err; // important
            }
                    
        }

   export async function fetchApiWithId (api, id){
            try {
               const res = await fetch(`${api}${id}`);
                if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
                return await res.json();
            } catch (err) {
                console.error(err);
                throw err; // important
            }
                   
   }

   export async function postApi (api, data){

     
    try {
              const res = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to post to ${api}: ${res.status} ${text}`);
                }

                const ct = res.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const json = await res.json();
                    console.log('Response from POST:', json);
                    return json;
                } else {
                    const txt = await res.text();
                    console.log('Response from POST (text):', txt);
                    return txt;
                            }

                } catch (err) {
                                console.error(err);
                                throw err;
                }
   }