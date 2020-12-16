const base_url = "https://api.football-data.org/v2/";

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getUCL2001() {
	if ("caches" in window) {
	    caches.match(base_url + 'competitions/2001/standings').then(function(response) {
	      if (response) {
	        response.json().then(function(data) {
	          	var standingsUCL = "";
	          	data.standings.forEach(function(group){
	          		if(group.type == 'TOTAL'){
	          			standingsUCL += `
	          				<div class="row">
	          					<h4>${group.group}</h4>
								<table class="responsive-table striped">
									<thead>
										<tr>
											<th>Position</th>
											<th>Nama Tim</th>
											<th>Jumlah Main</th>
											<th>Menang</th>
											<th>Seimbang</th>
											<th>Kalah</th>
											<th>Point</th>
											<th>Aksi</th>
										</tr>
									</thead>
									<tbody>
		          		`;
	          			group.table.forEach(function(data){
	          				standingsUCL += `
										<tr>
											<td>${data.position}</td>
											<td><div class="col s1"><img src="${data.team.crestUrl}" class="responsive-img"></div> ${data.team.name}</td>
											<td>${data.playedGames}</td>
											<td>${data.won}</td>
											<td>${data.draw}</td>
											<td>${data.lost}</td>
											<td>${data.points}</td>
											<td><a class="waves-effect waves-light btn-small" href="./tim.html?id=${data.team.id}">Info Klub</a></td>
										</tr>
	          				`;
	          			});
	          			standingsUCL += `
									</tbody>
								</table>
							</div>
	          			`;
	          		}
	          	});

	          	document.getElementById("body-content").innerHTML = standingsUCL;
	        });
	      }
	    });
	}

	fetch(base_url + 'competitions/2001/standings', {
		method: 'GET',
		mode: 'cors',
		redirect: 'follow',
		headers: new Headers({
			'X-Auth-Token': 'YOURTOKEN'
		})
	})
	.then(status)
	.then(json)
	.then(function(data){
		var standingsUCL = "";
      	data.standings.forEach(function(group){
      		if(group.type == 'TOTAL'){
      			standingsUCL += `
      				<div class="row">
      					<h4>${group.group}</h4>
						<table class="responsive-table striped">
							<thead>
								<tr>
									<th>Position</th>
									<th>Nama Tim</th>
									<th>Jumlah Main</th>
									<th>Menang</th>
									<th>Seimbang</th>
									<th>Kalah</th>
									<th>Point</th>
									<th>Aksi</th>
								</tr>
							</thead>
							<tbody>
          		`;
      			group.table.forEach(function(data){
      				standingsUCL += `
								<tr>
									<td>${data.position}</td>
									<td><div class="col s1"><img src="${data.team.crestUrl}" class="responsive-img"></div> ${data.team.name}</td>
									<td>${data.playedGames}</td>
									<td>${data.won}</td>
									<td>${data.draw}</td>
									<td>${data.lost}</td>
									<td>${data.points}</td>
									<td><a class="waves-effect waves-light btn-small" href="./tim.html?id=${data.team.id}">Info Klub</a></td>
								</tr>
      				`;
      			});
      			standingsUCL += `
							</tbody>
						</table>
					</div>
      			`;
      		}
      	});

      	document.getElementById("body-content").innerHTML = standingsUCL;
	})
	.catch(error);
}

function getTimById() {
	var urlParams = new URLSearchParams(window.location.search);
  	var idParam = urlParams.get("id");

	if ("caches" in window) {
	    caches.match(base_url + 'teams/' + idParam).then(function(response) {
	      if (response) {
	        response.json().then(function(data) {
	        	var pelatih;
	          	var tim = `
		            <div class="card">
		              <div class="card-image waves-effect waves-block waves-light">
		                <div class="col s6">
		                	<img src="${data.crestUrl}" class="center-align responsive-img" />
		                </div>
		              </div>
		              <div class="card-content">
		                <h4>${data.name}</h4>
		                <ul>
		                	<li>Alamat : ${data.address}</li>
		                	<li>Phone : ${data.phone}</li>
		                	<li>Website : ${data.website}</li>
		                	<li>Email : ${data.email}</li>
		                	<li>Markas : ${data.venue}</li>
		                	<li>Sejak : ${data.founded}</li>
		                </ul>
		                <h5>Pemain</h5>
		                <ul class="collection">
		        `;

		        data.squad.forEach(function(data){
		        	if(data.role == "PLAYER") {
			        	tim += `
    						<li class="collection-item">
						      	<span class="title">${data.name}</span>
						      	<p>${data.position}<br>
						      	No. Punggung ${data.shirtNumber}</p>
						    </li>
				        `;
			        } else if (data.role == "COACH") {
			        	pelatih = data;
			        }
		        });
		        
		        tim += `
						</ul>
						<h5>Pelatih</h5>
						<ul class="collection">
							<li class="collection-item">
						      	<span class="title">${pelatih.name}</span>
						    </li>
						</ul>
		              </div>
		            </div>
		        `;
		        

	          	document.getElementById("body-content").innerHTML = tim;
	        });
	      }
	    });
	}

	fetch(base_url + 'teams/' + idParam, {
		method: 'GET',
		mode: 'cors',
		redirect: 'follow',
		headers: new Headers({
			'X-Auth-Token': 'YOURTOKEN'
		})
	})
	.then(status)
	.then(json)
	.then(function(data){
		var pelatih;
      	var tim = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <div class="col s6">
                	<img src="${data.crestUrl}" class="center-align responsive-img" />
                </div>
              </div>
              <div class="card-content">
                <h4>${data.name}</h4>
                <ul>
                	<li>Alamat : ${data.address}</li>
                	<li>Phone : ${data.phone}</li>
                	<li>Website : ${data.website}</li>
                	<li>Email : ${data.email}</li>
                	<li>Markas : ${data.venue}</li>
                	<li>Sejak : ${data.founded}</li>
                </ul>
                <h5>Pemain</h5>
                <ul class="collection">
        `;

        data.squad.forEach(function(data){
        	if(data.role == "PLAYER") {
	        	tim += `
					<li class="collection-item">
				      	<span class="title">${data.name}</span>
				      	<p>${data.position}<br>
				      	No. Punggung ${data.shirtNumber}</p>
				    </li>
		        `;
	        } else if (data.role == "COACH") {
	        	pelatih = data;
	        }
        });
        
        tim += `
				</ul>
				<h5>Pelatih</h5>
				<ul class="collection">
					<li class="collection-item">
				      	<span class="title">${pelatih.name}</span>
				    </li>
				</ul>
              </div>
            </div>
        `;

	    document.getElementById("body-content").innerHTML = tim;
	})
	.catch(error);
}

function getJadwalUCLScheduled()
{
	if ("caches" in window) {
	    caches.match(base_url + 'competitions/2001/matches?status=SCHEDULED').then(function(response) {
	    	console.log(response.json())
	      if (response) {
	        response.json().then(function(data) {
	          	var matchesUCL = "";
	          	matchesUCL += `
					<ul class="collection with-header">
				        <li class="collection-header"><h4>Jadwal Pertandingan UCL (Waktu Indonesia)</h4></li>
          		`;
	          	data.matches.forEach(function(d){
	          		var date = new Date(d.utcDate);
	          		var tanggal = date.toLocaleDateString();
	          		var jam = date.toTimeString();
	          		matchesUCL += `
						<li class="collection-item">
							<p>
								${d.homeTeam.name} VS ${d.awayTeam.name}
								<button onclick="simpanjadwal('${d.id}', '${d.homeTeam.name} VS ${d.awayTeam.name}', '${tanggal} ${jam}')" class="button-simpan secondary-content waves-effect waves-light btn">Simpan</button><br>
								${tanggal} ${jam}
							</p>
						</li>
	          		`;
	          	});
	          	
	          	matchesUCL += `
					</ul>
          		`;

	          	document.getElementById("jadwalucl").innerHTML = matchesUCL;
	        });
	      }
	    });
	}

	fetch(base_url + 'competitions/2001/matches?status=SCHEDULED', {
		method: 'GET',
		mode: 'cors',
		redirect: 'follow',
		headers: new Headers({
			'X-Auth-Token': 'YOURTOKEN'
		})
	})
	.then(status)
	.then(json)
	.then(function(data){
		var matchesUCL = "";
      	matchesUCL += `
			<ul class="collection with-header">
		        <li class="collection-header"><h4>Jadwal Pertandingan UCL (Waktu Indonesia)</h4></li>
  		`;
      	data.matches.forEach(function(d){
      		var date = new Date(d.utcDate);
      		var tanggal = date.toLocaleDateString();
      		var jam = date.toTimeString();
      		matchesUCL += `
				<li class="collection-item">
					<p>
						${d.homeTeam.name} VS ${d.awayTeam.name}
						<button onclick="simpanjadwal('${d.id}', '${d.homeTeam.name} VS ${d.awayTeam.name}', '${tanggal} ${jam}')" class="button-simpan secondary-content waves-effect waves-light btn">Simpan</button><br>
						${tanggal} ${jam}
					</p>
				</li>
      		`;
      	});
      	
      	matchesUCL += `
			</ul>
  		`;

      	document.getElementById("jadwalucl").innerHTML = matchesUCL;
	})
	.catch(error);
}