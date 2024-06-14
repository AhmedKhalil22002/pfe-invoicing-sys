export default function printer(proxy: any) {
  if (proxy) console.log(JSON.parse(JSON.stringify(proxy)));
  else console.error('Proxy might be undefine');
}
