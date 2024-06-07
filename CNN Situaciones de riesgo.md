# Actividad: CNN Situaciones de riesgo
![Imagen](Riesgo.png)

En esta actividad se recopilarán varias imágenes de 5 situaciones de riesgo que son:
1. Incendios
2. Inundaciones
3. Tornados
4. Asaltos
5. Robos en Casa/Habitación

Estas imágenes serán obtenidas de fragmentos encontrados en internet, parecido al reconocimiento de rostros y de emociones, separar cada situación en diferentes carpetas, luego ejecutar el programa para determinar en cuantas si identifica bien y cuantas no identifica bien, para que al final le pongamos una imagen de internet ver si lo logra identificar correctamente.

# Código para obtener las imágenes de los videos

Importamos las librerías necesarias como la de OpenCV la misma del reconocimiento de emociones, le indicamos la ruta del video, luego en un hilo va a ir capturando las imágenes del video hasta que se acabe el video o se presione la tecla ESC, es recomendable dejar de ejecutar el programa presionando ESC, ya que si es cuando se acaba el video, el programa se traba, guarda las imágenes en una ruta especificada.

~~~
import numpy as np
import cv2 as cv
import math 

 

cap = cv.VideoCapture("C:\\Users\\Martin\\inundacion1.mp4")
i=1260
while True:
    ret, frame = cap.read()
    cv.imshow('img', frame)
    k = cv.waitKey(1)
    #if k == ord('a'):
    i=i+1
    frame = cv.resize(frame, (28,21), interpolation = cv.INTER_AREA)
    cv.imwrite('C:\\Users\\Martin\\sitriesgo\\inundaciones\\inundacion'+str(i)+'.jpg', frame )
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
~~~

# Código para identificar las situaciones de riesgo
Es un código muy extenso, pero simplemente analiza las imágenes las etiqueta con el nombre de la carpeta en la que están contenidas, puede detectar el suelo, generar gráficas de que tan preciso puede identificar las situaciones de riesgo, y que tanto pierde de precisión, también te muestra cuantas imágenes de las de prueba pudo identificar correctamente y cuantas no sabe identificar, ya al final del código le ponemos una ruta de una imagen para que identifique la situación de riesgo que hay en la imagen.

~~~
from skimage.transform import resize

images=[]
# AQUI ESPECIFICAMOS UNAS IMAGENES
filenames = ['roboimg1.jpg']

for filepath in filenames:
    image = plt.imread(filepath,0)
    image_resized = resize(image, (21, 28),anti_aliasing=True,clip=False,preserve_range=True)
    images.append(image_resized)

X = np.array(images, dtype=np.uint8) #convierto de lista a numpy
test_X = X.astype('float32')
test_X = test_X / 255.

predicted_classes = sport_model.predict(test_X)

for i, img_tagged in enumerate(predicted_classes):
    print(filenames[i], deportes[img_tagged.tolist().index(max(img_tagged))])
~~~