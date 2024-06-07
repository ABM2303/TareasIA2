# ACERTIJO CANÍBALES Y MISIONEROS
Supongamos que hay tres misioneros y tres caníbales que están en un lado de un río. Tienen un bote pequeño que puede llevar como máximo dos personas a la vez. El problema es que si en algún lado del río hay más caníbales que misioneros, los caníbales se comerán a los misioneros. El objetivo del juego es trasladar a todos los misioneros y a todos los caníbales al otro lado del río sin que esto ocurra.

## Solución
1. En el primer viaje van a ir un misionero y un caníbal, el caníbal queda del otro lado y el misionero regresa con los demás.
   > (CCCMMM # -> CCMMM C)
2. En el segundo viaje van los dos caníbales quedándose uno del otro lado.
    >(CCMMM C -> CMMM CC)
3. En el tercer viaje van dos misioneros, se realiza un intercambio, se queda un misionero del otro lado, y se regresa un caníbal al inicio. 
   >(CMMM CC -> CCMM CM)
4. En el cuarto viaje se van los dos misioneros y los dos se quedan del otro lado, el que regresa al inicio es el único caníbal que quedo. 
   >(CCMM CM -> CCC MMM)
5. En el quinto viaje se van los dos caníbales y ambos se quedan del otro lado, el que regresa al inicio es un misionero. 
   >(CCC MMM -> CM CCMM)
6. En el Último viaje son el misionero y el caníbal que faltaron y todos pasaron al otro lado sanos y salvos 
   >(CM CCMM -> # CCCMMM)