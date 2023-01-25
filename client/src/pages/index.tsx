import { useEffect, useRef, useState } from 'react';
import { TextInput, Title, Box, Button, Text } from '@mantine/core';
import awsIot from 'aws-iot-device-sdk';

const cliendId = 'testClient1231231231';

const device = new awsIot.device({
  protocol: 'wss',
  accessKeyId: 'dummy',
  secretKey: 'dummy',
  sessionToken: 'dummy',
  clientId: cliendId,
  host: 'dummy',
  region: 'us-east-1',
});

const topic = 'esp32/pub';

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    setChatMsg(chatMsg);
    device.publish(topic, JSON.stringify({ data: chatMsg }));
  }

  const effectRef = useRef(0);
  useEffect(() => {
    console.log('ONMESSAGE1');
    if (effectRef.current === 0) {
      effectRef.current = 1;
      return;
    }
    console.log('ONMESSAGE2');
    device
      .on('connect', function() {
        console.log('connect');
        
        device.subscribe(topic);
      });

    device
      .on('message', function(topic, payload) {
        console.log('message', topic, JSON.parse(payload.toString()).data);
        setMessages((currentArr) => [...currentArr, JSON.parse(payload.toString()).data]);
      });
  }, [])

  return (
    <div>
        <br />
        <Title order={1} align='center'>Prototype room</Title>
        <Box w='400px' sx={{ margin: 'auto', marginTop: '40px' }}>
          <TextInput onChange={(e) => setChatMsg(e.target.value)} placeholder='type message here' />
          <Button onClick={sendMessage} sx={{ marginTop: '10px' }}>Send</Button>
        </Box>

        <Box w='400px' sx={{ margin: 'auto', backgroundColor: 'gray', marginTop: '10px', padding: '10px' }}>
          {messages.map((msg, index) =>  <Text key={index} sx={{ borderRadius: '10px', backgroundColor: 'black', padding: '10px', width: 'auto', marginTop: '10px' }}>{msg}</Text>)}
        </Box>
    </div>
  );
}
