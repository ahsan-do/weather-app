import {router} from 'expo-router';
import {useFonts} from "expo-font";
import {useEffect} from "react";

export default function Index() {
    const [loaded] = useFonts({
        Poppins:require('../assets/fonts/Poppins-Regular.ttf'),
    })
    useEffect(() => {
        if (loaded){
            const timeoutId = setTimeout(()=>{
               router.push("/(tabs)/home");
            }, 1000);
            return ()=>clearTimeout(timeoutId);
        }
    },[loaded])
}