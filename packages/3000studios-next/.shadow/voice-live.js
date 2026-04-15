import record from 'node-record-lpcm16';
import WebSocket from 'ws';

const ws = new WebSocket('wss://api.elevenlabs.io/v1/voice-stream');

console.log('🎙️ Shadow listening (hotword: shadow)');

record.start({ sampleRateHertz: 16000 }).on('data', (data) => ws.send(data));

ws.on('message', (msg) => {
  const text = msg.toString().toLowerCase();
  if (text.includes('shadow deploy'))
    require('child_process').exec('powershell .shadow/deploy.ps1');
  if (text.includes('shadow repair'))
    require('child_process').exec('powershell .shadow/repair.ps1');
});
