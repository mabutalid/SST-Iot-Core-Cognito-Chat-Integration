export const main = async (event: any) => {
  console.log('=================HERE CONSUMING MQTT MESSAGE==========');
  console.log(typeof event);
  console.log(event.data);
  return event;
};
