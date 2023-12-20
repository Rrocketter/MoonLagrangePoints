import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters
moonlet_mass = 1e18  # Fixed moonlet mass in kg

# Function to calculate Lagrange point L2
def lagrange_point_l2(moonlet_mass, distance_earth_moon):
    r_l2 = distance_earth_moon * ((M_earth + moonlet_mass) / (3 * M_moon))**(1/3)
    return r_l2

# Function to calculate orbital parameters at Lagrange point L2
def calculate_orbital_parameters_l2(moonlet_mass, distance_earth_moon):
    r_l2 = lagrange_point_l2(moonlet_mass, distance_earth_moon)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l2**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l2  # Orbital speed

    return omega, orbital_period, orbital_speed, r_l2

# 3D plot
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Calculate orbital parameters at Lagrange point L2 for the fixed moonlet mass
angular_velocity, period, speed, l2 = calculate_orbital_parameters_l2(moonlet_mass, R_earth_moon)

# Plot Lagrange point L2
ax.scatter([l2], [0], [0], label=f'Mass: {moonlet_mass:.2e} kg')

# Plot Earth and Moon
ax.scatter([0], [0], [0], color='blue', label='Earth')
ax.scatter([R_earth_moon], [0], [0], color='gray', label='Moon')

# Set labels and title
ax.set_xlabel('X (meters)')
ax.set_ylabel('Y (meters)')
ax.set_zlabel('Z (meters)')
ax.set_title(f'Earth-Moon System with Lagrange Point L2 (Moonlet Mass: {moonlet_mass:.2e} kg)')

# Add legend
ax.legend()

# Show the plot
plt.show()
