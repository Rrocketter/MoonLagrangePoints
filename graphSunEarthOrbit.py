import numpy as np
import matplotlib.pyplot as plt

def earth_orbit(rEar, v0):

    # Set parameters:
    N = 365      # Earth days in a year
    dt = 1. / N  # Time Step: Fractions of a year - 1 Earth day (i.e. 1/365)

    # Create an array, for all variables, of size N with all entries equal to zero:
    xEar = np.zeros((N,))
    yEar = np.zeros((N,))
    vxEar = np.zeros((N,))
    vyEar = np.zeros((N,))

    # Initial Conditions:
    xEar[0] = rEar                   # (x0 = r, y0 = 0) in AU
    vyEar[0] = v0                    # units: AU/yr

    # Implement Verlet Algorithm:
    for k in range(0, N-1):
        rEar = (xEar[k]**2 + yEar[k]**2)**0.5
        vxEar[k+1] = vxEar[k] - ((mu * xEar[k]) / (rEar**3)) * dt
        xEar[k+1] = xEar[k] + vxEar[k+1] * dt
        vyEar[k+1] = vyEar[k] - ((mu * yEar[k]) / (rEar**3)) * dt
        yEar[k+1] = yEar[k] + vyEar[k+1] * dt

    # Plot:
    a, = plt.plot(xEar, yEar, 'go', markersize=1, label='Earth trajectory')
    plt.plot(0, 0, 'yo', label='Sun position')                  # yellow marker
    plt.plot(xEar[0], 0, 'bo', label='Earth initial position')  # dark blue marker
    plt.axis('equal')
    plt.xlabel('x')
    plt.ylabel('y')
    #plt.legend()   

    return a, xEar, yEar

# Average distance earth-sun (1 AU) in meter
au_to_m = 149_597_870_700.

mu = au_to_m**3 * 4 * np.pi**2  # Gravitational parameter

earth_orbit(au_to_m, np.sqrt(mu / au_to_m))
plt.show()
