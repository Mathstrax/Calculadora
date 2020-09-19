class CalcController {

    constructor(){
        this._operation = [];
        this._locale = 'pt-BR';
        this._displaycalcEl = document.querySelector("#display");
        this._DateEl  =  document.querySelector("#data");
        this._TimeEl  =  document.querySelector("#hora");
        this._CurrentDate;
        this.initialize();
        this.initbuttonsEvents();
        this._lastoperator = '';
        this._lastnumber = '';
        this.initkeyboard();
        this._audioonoff = false;
        this._audio = new Audio('clickk.mp3');
    }

    pastfromclipboard(){

        document.addEventListener('paste', e=>{
          let text =  e.clipboardData.getData('Text');
                

                this.displaycalc = parseFloat(text);
                console.log(text);
        });


    }

    copytoclipboard(){

        let input = document.createElement('input');

        input.value = this.displaycalc

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove();


    }

    initialize(){

            this.setDisplayDateTime();
             setInterval(() => {
                 this.setDisplayDateTime();
             },1000);

             this.setlastnumbertodisplay();

             this.pastfromclipboard();

             document.querySelectorAll('.btn-ac').forEach(btn=>{ 
                 btn.addEventListener('dblclick', e=> {
                    this.toggleaudio();

                 });
            });     
    }

        toggleaudio(){

            this._audioonoff = !this._audioonoff;


        }

        playaudio(){

            if (this._audioonoff) {

                this._audio.currentTime =0;
                
                this._audio.play();

            }


        }



        initkeyboard(){

            document.addEventListener('keyup', e=>{ 
            
              this.playaudio();

            switch(e.key){

                
                case'Escape':
                    this.clearAll();
                    break;
                case'Backspace':
                    this.clearentry();
                    break;
                case'+':
                case'-':
                case'*':
                case'/':
                case'%':
                this.addoperation(e.key);
                    break;
                case'Enter':
                case'=':
                    this.calc();
                    break;   
                case '.':
                case ',':
                    this.addodot('');
                break;
                    
                case '0':
                case '1':
                case '2':    
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':            
                    this.addoperation(parseInt(e.key));
                    break;
                case'c':
                    if(e.ctrlKey) this.copytoclipboard();
                    break;

            }
        });
        }


        addEventListenerAll(element, events, fn) {

            events.split(' ').forEach(event => {
                    element.addEventListener(event, fn, false);



            }); 
        }

        clearAll(){

            this._operation = [];
            this._lastnumber = '';
            this._lastoperator = '';
            this.setlastnumbertodisplay();
        }

        clearentry(){

            this._operation.pop();
            this.setlastnumbertodisplay();

        }

        getlastoperation(){

            return this._operation[this._operation.length-1];


        }

        setlastoperation(value){

            this._operation[this._operation.length - 1] = value;

        }


        isoperator(value){

         return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
        
        
         }        


         pushoperation(value){

            this._operation.push(value);

            if (this._operation.length > 3) {

                

                this.calc();

                

            }

         }

         getresult(){

            try{ 
            return eval(this._operation.join(""));

            }catch(e){
                setTimeout(() => {
                    this.seterror();
                }, 1);
                



            }
         }


         calc(){

            let last = '';

            this._lastoperator = this.getlastiten();

                if (this._operation.length < 3) {

                    let firstiten = this._operation[0];
                    this._operation = [firstiten, this._lastoperator, this._lastnumber];

                }


            if (this._operation.length > 3) {

                last = this._operation.pop();                
                this._lastnumber = this.getresult();
           
            }else if (this._operation.length == 3) {
              
                this._lastnumber = this.getlastiten(false);

            }
            
            console.log('_lastoperator', this._lastoperator);
            console.log('_lastonumber', this._lastnumber);
            
            let result = this.getresult();
            
            if(last == '%') {

                result /= 100;

                this._operation = [result];

            } else {

                this._operation = [result];

                if(last) this._operation.push(last);
           
           
            }            

            this.setlastnumbertodisplay();

         }

         getlastiten(isoperator = true){

            let lastiten;

            for (let i = this._operation.length-1; i >= 0; i--){
                   
                if(this.isoperator(this._operation[i])==isoperator){
                    lastiten = this._operation[i];
                    break;

                }  
            } 
           
            if(!lastiten) {

                lastiten = (isoperator) ? this._lastoperator : this._lastnumber;

            }

            return lastiten;

        }

         setlastnumbertodisplay(){


            let lastnumber = this.getlastiten(false);

            if(!lastnumber) lastnumber = 0

            this.displaycalc = lastnumber;

         }

        addoperation(value){
            
            if (isNaN(this.getlastoperation())){

                if(this.isoperator(value)){
                    this.setlastoperation(value);
                }  else {   
                    this.pushoperation(value); 
               
                    this.setlastnumbertodisplay();
               
                }


            
            
            
            
            } else {
                

                if (this.isoperator(value)){

                    this.pushoperation(value);



                } else{

                    let newvalue =  this.getlastoperation().toString() + value.toString();
                    this.setlastoperation(newvalue);

                    this.setlastnumbertodisplay();

                }


             
            }             
            
        }


        seterror(){

            this.displaycalc = 'error';

        }

        addodot(){

            let lasttoperation = this.getlastoperation();

            if(typeof lasttoperation === 'string' && lasttoperation.split("").indexOf('.') > -1) return;

            if (this.isoperator(lasttoperation) || !lasttoperation ){
                this.pushoperation('0.');
            } else {
                this.setlastoperation(lasttoperation.toString() + '.');
            }
            this.setlastnumbertodisplay();

        }

        execbtn(value){

            this.playaudio();

            switch(value){
                case'ac':
                    this.clearAll();
                    break;
                case'ce':
                    this.clearentry();
                    break;
                case'soma':
                    this.addoperation('+');
                    break;
                case'subtracao':
                    this.addoperation('-');
                    break;   
                case'divisao':
                    this.addoperation('/');
                    break;
                case'multiplicacao':
                    this.addoperation('*');
                    break;
                case'porcento':
                    this.addoperation('%');
                    break;
                case'igual':
                    this.calc();
                    break;   
                case 'ponto':
                    this.addodot('.');
                break;
                    
                case '0':
                case '1':
                case '2':    
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':            
                    this.addoperation(parseInt(value));
                    break;



                default:
                    this.seterror();
                    break;
            }
        }
     
    initbuttonsEvents(){

        
        let buttons = document.querySelectorAll('#buttons > g, #parts > g');
                buttons.forEach((btn, index)=>{          
                    
                    
                    this.addEventListenerAll(btn, 'click drag', e => {  
                        let textbtn = btn.className.baseVal.replace("btn-","");
                        this.execbtn(textbtn);
                    });
                    
                
                    this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e=> {  
                        btn.style.cursor = 'pointer';
                
                    })
                

                    });
                } 
        
    

        setDisplayDateTime(){

            this.displayDate = this.CurrentDate.toLocaleDateString(this._locale, {day: '2-digit',month: 'long', year:'numeric'})
            this.displayTime = this.CurrentDate.toLocaleTimeString(this._locale)

        }



        get displayTime(){
            return this._TimeEl.innerHTML;
        }
        set displayTime(value){
            return this._TimeEl.innerHTML = value
         }
         get displayDate(){
            return this._DateEl.innerHTML 
         }
        set displayDate(value){
            return this._DateEl.innerHTML = value
         }

        
        
        
        
        
        
        
        
        
        
        
        
        get displaycalc(){
        return this._displaycalcEl.innerHTML
        }
        set displaycalc(value){

            if(value.toString().length > 10){
                this.seterror()
                return false;
            }

        this._displaycalcEl.innerHTML = value;
    
        }
        get CurrentDate(){
        return new Date();
        }       
        set CurrentDate(value){
        this.CurrentDate = value;
    }
}    