import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { Mylaps } from '../../../mylaps-amb/dist';

let mainWindow: Electron.BrowserWindow | null;
let getTimeInterval: NodeJS.Timeout | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  const decoder = new Mylaps.Communicator();
  decoder.on('connect', (msg) => {

    decoder.getTime();
    // request the decoders rtc every 5 minutes.
    getTimeInterval = setInterval(() => {
      decoder.getTime()
    }, 60 * 1000)
  });

  decoder.on('time', (msg) => {
    mainWindow.webContents.send('amb-time', msg);
  })

  decoder.on('status', (msg) => {
    mainWindow.webContents.send('amb-status', msg);
  });

  decoder.on('passing', (msg) => {
    let message = {
      decoderId: msg.decoderId,
      passingTimeRTC: msg.passingTimeRTC ? msg.passingTimeRTC.getTime() : undefined,
      passingTimeUTC: msg.passingTimeUTC ? msg.passingTimeUTC.getTime() : undefined,
      signalHits: msg.signalHits,
      signalStrength: msg.signalStrength,
      transponderId: msg.transponderId,
      transponderTemperature: msg.transponderTemperature,
      transponderVoltage: msg.transponderVoltage
    }

    mainWindow.webContents.send('amb-passing', message);
  });

  decoder.on('connect', (msg) => {
    mainWindow.webContents.send('amb-connected', msg);
  })

  decoder.on('error', (msg) => {
    clearInterval(getTimeInterval);
    mainWindow.webContents.send('amb-disconnected', msg);
  });

  decoder.on('close', (msg) => {
    clearInterval(getTimeInterval);
    mainWindow.webContents.send('amb-disconnected', msg);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.allowRendererProcessReuse = true;