
   export default function () {
    const generateMonthBoundaries = ()=>{
        const  text = new Date().toISOString()
        const reg = /\d+T/
        const start = text.replace(reg,"01T00:00:00")
        const end = text.replace(reg,"30T23:59:00")
        return [ start, end]
       }

       
       function getPastWeekDays() {
        const result = [];
        const today = new Date();
        
        for (let i = 1; i <= 7; i++) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
      
          const startOfDay = new Date(day);
          startOfDay.setUTCHours(0, 0, 0, 0);
      
          const endOfDay = new Date(day);
          endOfDay.setUTCHours(23, 59, 59, 999); // Set milliseconds to 999 to ensure end of the day
      
          result.push({
            start: startOfDay.toISOString(),
            end: endOfDay.toISOString()
          });
        }

        return result;
      }
//generates an array of concise dates ie : 11/5/2023  
   function getDatesWithoutTime(array){
return array.map((date)=>new Intl.DateTimeFormat('en-US').format( new Date(date)))
}


    return {generateMonthBoundaries, getPastWeekDays, getDatesWithoutTime}
   }  