

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import * as Battery from 'expo-battery';
import * as Cellular from 'expo-cellular';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';
import * as Network from 'expo-network';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BACKGROUND_FETCH_TASK = 'background-fetch';
let EXECUTED = false;

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
    const deviceInfo  = await getDeviceInformation();
    await sendHeartBeat(EXECUTED, deviceInfo); 
  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {

    
    //store device serial number
    storeDeviceId();

  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}



 const  getDeviceInformation = async () => {
    const now = Date.now();
    const batteryLevel = await Battery.getBatteryLevelAsync();
    const cellular = await Cellular.getCarrierNameAsync()
    const deviceModelName = Device.modelName
    const deviceUptime = await Device.getUptimeAsync()
    const deviceProductName = Device.productName
    const ipAddress = await await Network.getIpAddressAsync();

    const uptime = Math.floor(deviceUptime / 60);
    const uptimeHours = Math.floor(uptime / 60);
    const uptimeMinutes = uptime % 60;

    NetInfo.fetch().then(state => {
        console.log('Connection type', state.type);
        console.log('Is connected?', state.isConnected);
      });
      console.log(`Got background fetch call at date: ${batteryLevel}`);
      console.log(`Cellular: ${cellular}`);
      console.log(`Device Model Name: ${deviceModelName}`);
  
      console.log(`Device Uptime: ${uptimeHours} hours and ${uptimeMinutes} minutes`);
      console.log(`Device Product name: ${deviceProductName}`);
      console.log(`IP Address: ${ipAddress}`);

    //   const igu = {
    //     ip: ipAddress,
    //     geo: geo
       
    
        const seriallNumber = await getSerialNumber();
        return { 
            data: {
                name: "asdasdad",
                serialNumber: "7c37a9d6-54d9-4931-919d-12cc2c37574d",
             
            }
          

        }
        
  
    
}
const storeDeviceId = async () => {

    let uuid = uuidv4();
    // await SecureStore.setItemAsync('secure_deviceid', JSON.stringify(uuid));
    let serialNumber = await AsyncStorage.getItem('serialNumber');
    console.log(serialNumber)
    console.log(uuid)
    if(serialNumber === null) {
        try {
            await AsyncStorage.setItem('serialNumber',uuid)
            console.log('stored', uuid);
          } catch (e) {
    
        }
    }
  
  }

  const getSerialNumber = async () => {

    let seriallNumber = await AsyncStorage.getItem('serialNumber');
    console.log(seriallNumber)
    return seriallNumber
    }
async function sendHeartBeat(executed: boolean, heartbeat: object) {

    if (!EXECUTED) {

        try {
            var bearer = 'Bearer ' + "a8a811e23501c1a84da97004a0cec6fa93d79f9f2bb0209300e2929eb458c00b81e9a0cec1858ed15a0c41155044bd22a329f67a2980370b8630238752ecb74d9d584a741ec3e04c57d4ea25cf3f933f1c5093a8f3546a6bc757720112857d42c779ce29f4f00a8e57b31a89f37070db30218fd4e848a5309318a00460fe3202";
            const response = await fetch('https://thutotime-api.herokuapp.com/api/devices', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': bearer
                },
                body: JSON.stringify(heartbeat)
            });
            const responseJson = await response.json();
            console.log(responseJson);
            if (responseJson.status === 200) {
                console.log("Device information sent successfully");
                //setExecuted(true);
                EXECUTED = true;
                unregisterBackgroundFetchAsync();
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}


function setExecuted(executed: boolean) { 

    EXECUTED = executed;
}

export const getRequiredPermisions = async () => {

}