(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var CASOS = { 1: "Protestas en el sur andino", 2: "Niños y metales pesados", 3: "Defensores ambientales" };

  // Velas: una por cada civil muerto
  var velas = document.getElementById("velas");
  if (velas) {
    for (var i = 0; i < 49; i++) {
      var v = document.createElement("span");
      v.className = "vela";
      v.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
      velas.appendChild(v);
    }
  }

  // 100 niños: 85 en gris plomo
  var ninos = document.getElementById("ninos");
  if (ninos) {
    var figura = '<svg viewBox="0 0 30 50" aria-hidden="true"><circle cx="15" cy="8" r="7"/><path d="M6 18h18l-2 16h-3v16h-4V36h-1v14H10V34H8z"/></svg>';
    for (var n = 0; n < 100; n++) {
      var d = document.createElement("span");
      d.className = "nino " + (n < 85 ? "plomo" : "sano");
      d.innerHTML = figura;
      ninos.appendChild(d);
    }
  }

  // Audios: el botón aparece solo si el archivo existe
  document.querySelectorAll(".audio[data-src]").forEach(function (cont) {
    var audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", function () {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = "▶ Escucha la historia";
      b.addEventListener("click", function () {
        if (audio.paused) { audio.play(); b.textContent = "❚❚ Pausar"; }
        else { audio.pause(); b.textContent = "▶ Escucha la historia"; }
      });
      audio.addEventListener("ended", function () { b.textContent = "▶ Escucha la historia"; });
      cont.appendChild(b);
    }, { once: true });
    audio.src = cont.getAttribute("data-src");
  });

  // Mapa
  var M = window.MAPA;
  var svg = document.getElementById("mapa-svg");
  var lista = document.getElementById("mapa-lista");
  if (M && svg) {
    var pad = 20;
    svg.setAttribute("viewBox", (-pad) + " " + (-pad) + " " + (M.W + pad * 2) + " " + (M.H + pad * 2));
    M.vecinos.forEach(function (p) { var e = document.createElementNS(NS, "path"); e.setAttribute("d", p); e.setAttribute("class", "vecino"); svg.appendChild(e); });
    var peru = document.createElementNS(NS, "path"); peru.setAttribute("d", M.peru); peru.setAttribute("class", "peru"); svg.appendChild(peru);

    var panel = document.getElementById("mapa-panel");
    var nodos = {}, botones = {};
    function mostrar(p) {
      panel.className = "mapa-panel c" + p.caso;
      document.getElementById("mp-region").textContent = p.region + " · " + CASOS[p.caso];
      document.getElementById("mp-lugar").textContent = p.lugar;
      document.getElementById("mp-fecha").textContent = p.fecha;
      document.getElementById("mp-texto").textContent = p.texto;
      Object.keys(nodos).forEach(function (k) { nodos[k].classList.toggle("activo", k === p.id); });
      Object.keys(botones).forEach(function (k) { botones[k].setAttribute("aria-pressed", k === p.id ? "true" : "false"); });
    }
    M.puntos.forEach(function (p) {
      var g = document.createElementNS(NS, "g");
      var x = p.xy[0], y = p.xy[1];
      if (p.caso === 0) {
        g.setAttribute("class", "lima");
        g.innerHTML = '<circle cx="' + x + '" cy="' + y + '" r="5"/><text x="' + (x - 12) + '" y="' + (y + 5) + '" text-anchor="end">Lima</text>';
        svg.appendChild(g);
        return;
      }
      g.setAttribute("class", "punto c" + p.caso);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", p.lugar + ", " + p.region);
      var izq = p.id === "ayacucho" || p.id === "oroya";
      g.innerHTML = '<circle class="halo" cx="' + x + '" cy="' + y + '" r="20"/><circle class="nucleo" cx="' + x + '" cy="' + y + '" r="8"/>' +
        '<text x="' + (izq ? x - 16 : x + 16) + '" y="' + (y + 5) + '" text-anchor="' + (izq ? "end" : "start") + '">' + p.lugar + '</text>';
      g.addEventListener("click", function () { mostrar(p); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mostrar(p); } });
      svg.appendChild(g);
      nodos[p.id] = g;

      if (lista) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "c" + p.caso;
        b.innerHTML = p.lugar + "<small>" + p.region + " · " + p.fecha + "</small>";
        b.addEventListener("click", function () { mostrar(p); });
        li.appendChild(b);
        lista.appendChild(li);
        botones[p.id] = b;
      }
    });
  }

  // Compartir
  var url = location.href.split("#")[0];
  var texto = "Invisibles para el Estado: tres casos reales de vulneración de derechos en el Perú. ";
  var wa = document.getElementById("share-wa");
  var fb = document.getElementById("share-fb");
  if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(texto + url);
  if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  var copiar = document.getElementById("share-copiar");
  if (copiar) copiar.addEventListener("click", function () {
    var listo = function () { copiar.textContent = "Enlace copiado"; setTimeout(function () { copiar.textContent = "Copiar enlace"; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(listo, function () { copiar.textContent = url; });
    } else { copiar.textContent = url; }
  });

  // Enlaces opcionales
  var C = window.CONFIG || {};
  if (C.formularioCompromiso) { document.getElementById("link-compromiso").href = C.formularioCompromiso; document.getElementById("accion-compromiso").hidden = false; }
  if (C.muroMensajes) { document.getElementById("link-muro").href = C.muroMensajes; document.getElementById("accion-muro").hidden = false; }
})();
