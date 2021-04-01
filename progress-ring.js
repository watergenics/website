class ProgressRing extends HTMLElement {
    constructor() {
      super();
      const stroke = this.getAttribute("stroke");
      const radius = this.getAttribute("radius");
      const unit = this.getAttribute("unit");
      const label = this.getAttribute("label");
      const normalizedRadius = radius - stroke * 2;
      this._circumference = normalizedRadius * 2 * Math.PI;
  
      this._root = this.attachShadow({mode: "open"});
      this._root.innerHTML = `
        <svg
          height="${radius * 2}"
          width="${radius * 2}"
         >
           <circle
             id="valueLine"
             stroke="white"
             stroke-dasharray="${this._circumference} ${this._circumference}"
             style="stroke-dashoffset:${this._circumference}"
             stroke-width="${stroke}"
             fill="transparent"
             r="${normalizedRadius}"
             cx="${radius}"
             cy="${radius}"
          />
        </svg>

        <div>
        <p id="label">${label}</p>
        <p id="percent">XX%</p>
        <p id="uint">${unit}</p>
        </div>
  
        <style>
          div{
            display: flex;  
            flex-direction: column;
            width: ${2 * radius}px;
            height: ${2 * radius}px;
            align-items: center; /* align vertical */
            position:absolute;
            top: ${radius/2*1.2}px;
          }
          circle {
            transition: stroke-dashoffset 0.35s;
            transform: rotate(135deg);
            transform-origin: 50% 50%;
          }
          p{
            width:auto;
            text-align: center;
            font-size: 1em;
            line-height: 1em;
            margin: 0;
          }
          #percent{
            font-size: 3em;
          }
        </style>
      `;
    }
    
    setProgress(percent) {
      const offset = this._circumference - (percent*0.75 / 100 * this._circumference);
      const circle = this._root.querySelector("circle");
      circle.style.strokeDashoffset = offset; 
      if(percent > 100){
        this._root.getElementById("valueLine").style.stroke="red";
      } else {
        this._root.getElementById("valueLine").style.stroke="white";
      }
    }
  
    static get observedAttributes() {
      return ["progress"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "progress") {
        newValue = Number(newValue).toFixed(1);
        this.setProgress(newValue);
        this._root.getElementById("percent").innerHTML = newValue;
      }
    }
  }
  
  window.customElements.define("progress-ring", ProgressRing);