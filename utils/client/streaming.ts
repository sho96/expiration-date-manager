export async function* streamingFetch( input: RequestInfo | URL, init?: RequestInit ) {

    const response = await fetch( input, init)  
    const reader  = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
  
    for( ;; ) {
        const { done, value } = await reader.read()
        if( done ) break;

        try {
            yield decoder.decode(value)
        }
        catch( e:any ) {
            console.warn( e.message )
        }
      
    }
}

export function decodeVercelAiStream(value: string) {
/*
data: "ン、ピーマンなど）\n- 油\n"
data: "- ソース（お好みで）\n\n**"
*/
    const datas = value.split("\n").filter((data) => data.startsWith("data: ")).map((data) => data.slice(7, -1));
    console.log(datas)
    return datas.join("");
}