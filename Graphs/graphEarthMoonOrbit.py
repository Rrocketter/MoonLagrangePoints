import numpy as np
import matplotlib.pyplot as plt

def moon_orbit(rMoon, v0):

    # Set parameters:
    N = 27      # Moon days in a year
    dt = 1. / N  # Time Step: Fractions of a year - 1 Moon day (i.e. 1/27)

    # Create an array, for all variables, of size N with all entries equal to zero:
    xMoon = np.zeros((N,))
    yMoon = np.zeros((N,))
    vxMoon = np.zeros((N,))
    vyMoon = np.zeros((N,))

    # Initial Conditions:
    xMoon[0] = rMoon                   # (x0 = r, y0 = 0) in AU
    vyMoon[0] = v0                    # units: AU/yr

    # Implement Verlet Algorithm:
    for k in range(0, N-1):
        rMoon = (xMoon[k]**2 + yMoon[k]**2)**0.5
        vxMoon[k+1] = vxMoon[k] - ((mu * xMoon[k]) / (rMoon**3)) * dt
        xMoon[k+1] = xMoon[k] + vxMoon[k+1] * dt
        vyMoon[k+1] = vyMoon[k] - ((mu * yMoon[k]) / (rMoon**3)) * dt
        yMoon[k+1] = yMoon[k] + vyMoon[k+1] * dt

    # Plot:
    a, = plt.plot(xMoon, yMoon, 'go', markersize=1, label='Moon trajectory')
    plt.plot(0, 0, 'yo', label='Earth position')                  # blue marker
    plt.plot(xMoon[0], 0, 'bo', label='Moon initial position')  # red marker
    plt.axis('equal')
    plt.xlabel('x')
    plt.ylabel('y')
    #plt.legend()

    return a, xMoon, yMoon

# Average distance moon-earth (1 AU) in meter
au_to_m = 384_400_000.

mu = au_to_m**3 * 4 * np.pi**2  # Gravitational parameter

moon_orbit(au_to_m, np.sqrt(mu / au_to_m))
plt.show()
