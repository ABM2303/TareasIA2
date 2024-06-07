import cv2 as cv
import numpy as np

img = cv.imread('tr.png',0)
img2 = np.zeros((w*2, h*2), dtype=np.uint8)
cv = imshow(mimg.shape[:2]arco1, img2)
#print(w,h)img.shape
for i in range(W):
    for j in range(h):
        img2[i,j]=img[i*2,j*2]
cv.imshow('marco2', img)
cv.waitKey(0)
cv.destroyAllWindows()        