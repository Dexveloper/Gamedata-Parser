export function read(data: Uint8Array){
  const definitions = getDefinitions(data);
  const result: [string,Uint8Array][] = [];

  for (const definition of definitions){
    const name = new TextDecoder("utf-16be").decode(definition).split("\0")[0].replace("-1r.","-1/r.");
    // Replace call fixes a naming inconsistency for Nether region files.

    const metadata = new Uint8Array(definition.slice(128));
    const view = new DataView(metadata.buffer);

    const length = view.getInt32(0);
    const offset = view.getInt32(4);
    const size = offset + length;

    const file = data.slice(offset,size);
    result.push([name,file]);
  }

  return result;
}

function getDefinitions(data: Uint8Array){
  const view = new DataView(data.buffer);
  const offset = view.getInt32(0);
  const names = data.slice(offset);

  const result = chunkify(names,144);
  return result;
}

export function chunkify(data: Uint8Array, length: number){
  const result = [];
  for (let i = 0; i < data.length; i += length){
    const size = i + length;
    const chunk = data.slice(i,size);
    result.push(chunk);
  }
  return result;
}