   
//La API que use para este proyecto es: https://www.metaweather.com/api/   
   
   let $todayTile = document.querySelector(".today-title"),
     $todayState = document.querySelector(".today-state"),
     $todayDate = document.querySelector(".today-date"),
     $location= document.querySelector(".location"),
     $todayIcon = document.querySelector(".today-icon"),
     $fiveDays = document.querySelector(".fivedays");



     //variables para seccion highlights

     let $airPressure = document.querySelector(".air_pressure"),
      $visibility = document.querySelector(".visibility"),
      $humidity = document.querySelector(".humidity"),
      $windStatus = document.querySelector(".wind-status")

  
//Variables para el buscador (search)
let $form = document.querySelector(".form")
    


//Funcion para obtener los datos de la api y pintarlos en pantalla
  const obtenerDatos =  async (city) => {
  
    const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
   
    try {
     let res = await fetch(`${corsAnywhere}https://www.metaweather.com/api/location/search/?query=${city}`),
      json = await res.json()
   
      setTimeout( async function () {
              let res2 = await fetch(`${corsAnywhere}https://www.metaweather.com/api/location/${json[0].woeid}/`),
              json2 = await res2.json();

              if (!res.ok) throw { status: res.status, statusText: res.statusText };

              $fiveDays.innerHTML = ""

               //Pronostico de 5 dias siguientes 
              for(let i = 1;i<json2.consolidated_weather.length;i++){
               
                 let imagen = json2.consolidated_weather[i].weather_state_name;
                 
                  const $div = document.createElement("div");
                  const $h4 = document.createElement("h4");
                  const $img = document.createElement("img");
                  const $p = document.createElement("p");
                  
                  if(i === 1){
                    $h4.textContent = "Tomorrow";
                  }else{
                    let fecha = new Date(json2.consolidated_weather[i].applicable_date)
                    $h4.textContent = fecha.toUTCString().slice(0,11);
                
                  }
                  $p.innerHTML = `<b>${json2.consolidated_weather[i].max_temp.toFixed(0)}°C </b> ${"-"} ${json2.consolidated_weather[i].min_temp.toFixed(0)}°C `
                  $img.setAttribute("src",`assets/${imagen.replace(/ /g, "")}.png`)
                  $div.appendChild($h4)
                  $div.appendChild($img)
                  $div.appendChild($p)
                  $fiveDays.appendChild($div)
                 }
                
                
              
              
                  //Pronostico de hoy parte izquierda
                  let date = new Date(json2.time);
                  
                  let imagenURL = json2.consolidated_weather[0].weather_state_name;
                
                  $todayIcon.setAttribute("src",`assets/${imagenURL.replace(/ /g, "")}.png`)
                  $todayTile.innerHTML = `${json2.consolidated_weather[0].the_temp.toFixed(0)} °C`;
                  $todayState.innerHTML = ` ${json2.consolidated_weather[0].weather_state_name}`;
                  $todayDate.innerHTML = `Today . ${date.toUTCString().slice(0,11)}` //OJO ACA
                  $location.innerHTML = `<img src="assets/mapa.png"> ${json2.title}`
              
                  
              
              
              
                  //Pronostico de hoy Highlights 
              
                 $airPressure.innerHTML = `Air Pressure <br> ${json2.consolidated_weather[0].air_pressure} mb`;
                 $visibility.innerHTML = `Visibility <br> ${json2.consolidated_weather[0].visibility.toFixed(1)} miles`
                 $humidity.innerHTML = `<p>Humidity</p>  <p>${json2.consolidated_weather[0].humidity}</p> %  <progress  max="100" value="${json2.consolidated_weather[0].humidity}"> 70% </progress>`
                 $windStatus.innerHTML = `Wind Status <br> ${json2.consolidated_weather[0].wind_speed.toFixed(1)}km/h. `
                 
       },1000)
       } 
    catch(err){
      let message = err.statusText || "Ocurrió un error";
      $todayTile.insertAdjacentHTML(
        "afterend",
        `<p><b>Error ${err.status}: ${message}</b></p>`)
  }
}



//Codigo para la busqueda de diferentes ciudades
document.addEventListener("submit", e => {
  if(e.target === $form) {
      e.preventDefault();
      obtenerDatos(e.target.ubicacion.value)
      e.target.ubicacion.value = ""
  }
})


//Al cargar la pagina, por default nos va a mostrar la temperatura de Buenos Aires
document.addEventListener("DOMContentLoaded", e => {
  obtenerDatos("Buenos aires")
})


   
