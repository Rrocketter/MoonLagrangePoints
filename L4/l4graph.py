import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters
standard_moonlet_mass = 1e18

# Function to calculate Lagrange point L4 location
def lagrange_point_l4_location():
    x_l4 = 0.5 * R_earth_moon
    y_l4 = (np.sqrt(3) / 2) * R_earth_moon
    return x_l4, y_l4

# Function to calculate orbital parameters at Lagrange point L4
def calculate_orbital_parameters_l4(moonlet_mass, distance_earth_moon):
    x_l4, y_l4 = lagrange_point_l4_location()

    # Use x_l4 and y_l4 as the coordinates of Lagrange point L4
    r_l4 = np.sqrt(x_l4**2 + y_l4**2)

    # Centripetal acceleration formula: ac = w^2 * r
    omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l4**3)  # Angular velocity
    orbital_period = 2 * np.pi / omega  # Orbital period
    orbital_speed = omega * r_l4  # Orbital speed

    return omega, orbital_period, orbital_speed, x_l4, y_l4

# Plotting
fig, ax = plt.subplots(figsize=(12, 12))  # Adjust the figure size

# Plot the Earth
earth_circle = plt.Circle((0, 0), 0.1 * R_earth_moon, color='blue', label='Earth')
ax.add_patch(earth_circle)

# Plot the Moon
moon_circle = plt.Circle((R_earth_moon, 0), 0.05 * R_earth_moon, color='gray', label='Moon')
ax.add_patch(moon_circle)

# Calculate orbital parameters at Lagrange point L4
angular_velocity, period, speed, x_l4, y_l4 = calculate_orbital_parameters_l4(standard_moonlet_mass, R_earth_moon)

# Plot Lagrange Point L4 with a larger size
l4_point_size = 8e6
l4_point = plt.Circle((x_l4, y_l4), l4_point_size, color='red', label=f'L4 Point, Mass={standard_moonlet_mass} kg')
ax.add_patch(l4_point)

# Set labels and legend
ax.set_xlim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)  # Adjust the x-axis limits
ax.set_ylim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_aspect('equal', 'box')
plt.title("Earth, Moon, and Lagrange Point L4")
plt.legend()
plt.show()
