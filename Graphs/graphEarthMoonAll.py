import numpy as np
import matplotlib.pyplot as plt

def moon_orbit(rMoon, v0, label):
    N = 200     # Increase the number of points for a smoother orbit
    dt = 1. / N

    xMoon = np.zeros(N)
    yMoon = np.zeros(N)
    vxMoon = np.zeros(N)
    vyMoon = np.zeros(N)

    xMoon[0] = rMoon
    vyMoon[0] = v0

    for k in range(0, N-1):
        rMoon = np.sqrt(xMoon[k]**2 + yMoon[k]**2)
        vxMoon[k+1] = vxMoon[k] - ((mu * xMoon[k]) / (rMoon**3)) * dt
        xMoon[k+1] = xMoon[k] + vxMoon[k+1] * dt
        vyMoon[k+1] = vyMoon[k] - ((mu * yMoon[k]) / (rMoon**3)) * dt
        yMoon[k+1] = yMoon[k] + vyMoon[k+1] * dt

    a, = plt.plot(xMoon, yMoon, label=label)
    return a

# Average distance moon-earth (1 AU) in meters
au_to_m = 384_400_000.

mu = au_to_m**3 * 4 * np.pi**2  # Gravitational parameter

# Create separate objects for each moon
moon1 = moon_orbit(au_to_m, np.sqrt(mu / au_to_m), 'Moon 1 (Original)')
moon2 = moon_orbit(0.75 * au_to_m, np.sqrt(mu / (0.75 * au_to_m)), 'Moon 2 (0.75 Original)')
moon3 = moon_orbit(1.25 * au_to_m, np.sqrt(mu / (1.25 * au_to_m)), 'Moon 3 (1.25 Original)')

plt.plot(0, 0, 'yo', label='Earth position')
plt.axis('equal')
plt.xlabel('x (AU)')
plt.ylabel('y (AU)')
plt.legend()
plt.title('Orbits of Moons around Earth')
plt.show()
