import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

# Function to calculate Lagrange point L5 location
def lagrange_point_l5_location():
    x_l5 = 0.5 * R_earth_moon
    y_l5 = -np.sqrt(3) / 2 * R_earth_moon
    return x_l5, y_l5

# Function to calculate orbital parameters at Lagrange point L5
def calculate_orbital_parameters_l5(moonlet_mass, distance_earth_moon):
    x_l5, y_l5 = lagrange_point_l5_location()

    # Use x_l5 and y_l5 as the coordinates of Lagrange point L5
    r_l5 = np.sqrt(x_l5**2 + y_l5**2)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l5**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l5  # Orbital speed

    return omega, orbital_period, orbital_speed, x_l5, y_l5

# Example moonlet mass
moonlet_mass = 1e18

# Plotting
fig, ax = plt.subplots(figsize=(12, 12))  # Adjust the figure size

# Plot the Earth
earth_circle = plt.Circle((0, 0), 0.1 * R_earth_moon, color='blue', label='Earth')
ax.add_patch(earth_circle)

# Plot the Moon
moon_circle = plt.Circle((R_earth_moon, 0), 0.05 * R_earth_moon, color='gray', label='Moon')
ax.add_patch(moon_circle)

# Calculate orbital parameters at Lagrange point L5
angular_velocity, period, speed, x_l5, y_l5 = calculate_orbital_parameters_l5(moonlet_mass, R_earth_moon)

# Plot Lagrange Point L5 with a larger size
l5_point_size = 8e6
l5_point = plt.Circle((x_l5, y_l5), l5_point_size, color='red', label=f'L5 Point, Mass={moonlet_mass} kg')
ax.add_patch(l5_point)

# Set labels and legend
ax.set_xlim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)  # Adjust the x-axis limits
ax.set_ylim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_aspect('equal', 'box')
plt.title(f"Earth, Moon, and Lagrange Point L5 (Moonlet Mass={moonlet_mass} kg)")
plt.legend()
plt.show()
