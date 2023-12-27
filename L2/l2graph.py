import numpy as np
import matplotlib.pyplot as plt

# Constants
GRAVITATIONAL_CONSTANT = 6.67e-11
EARTH_MASS = 5.97e24
MOON_MASS = 7.35e22
EARTH_MOON_DISTANCE = 3.84e8

# Function to calculate Lagrange point L2
def lagrange_point_l2(moonlet_mass, distance_earth_moon):
    r_l2 = distance_earth_moon * ((MOON_MASS - moonlet_mass) / (3 * MOON_MASS))**(1 / 3)
    return r_l2

# Function to calculate orbital parameters at Lagrange point L2
def calculate_orbital_parameters(moonlet_mass, distance_earth_moon):
    r_l2 = lagrange_point_l2(moonlet_mass, distance_earth_moon)

    omega = np.sqrt(GRAVITATIONAL_CONSTANT * (MOON_MASS + moonlet_mass) / r_l2**3)
    orbital_period = 2 * np.pi / omega
    orbital_speed = omega * r_l2

    return omega, orbital_period, orbital_speed, r_l2

# Example values
moonlet_mass = 1e18

# Calculate orbital parameters at Lagrange point L2
angular_velocity, period, speed, r_l2 = calculate_orbital_parameters(moonlet_mass, EARTH_MOON_DISTANCE)

# Plotting
fig, ax = plt.subplots(figsize=(12, 12))  # Adjust the figure size

# Plot the Earth
earth_circle = plt.Circle((0, 0), EARTH_MOON_DISTANCE / (5 * (1 + MOON_MASS / EARTH_MASS)), color='blue', label='Earth')
ax.add_patch(earth_circle)

# Plot the Moon
moon_circle = plt.Circle((EARTH_MOON_DISTANCE, 0), EARTH_MOON_DISTANCE / (1 + EARTH_MASS / MOON_MASS), color='gray', label='Moon')
ax.add_patch(moon_circle)

# Plot the Lagrange point L2 with a larger size
l2_point_size = 4e6
l2_point = plt.Circle((EARTH_MOON_DISTANCE + r_l2, 0), l2_point_size, color='red', label='L2 Point')
ax.add_patch(l2_point)

# Set labels and legend
ax.set_xlim(-1.5 * EARTH_MOON_DISTANCE, 2.5 * EARTH_MOON_DISTANCE)  # Adjust the x-axis limits
ax.set_ylim(-1.5 * EARTH_MOON_DISTANCE, 1.5 * EARTH_MOON_DISTANCE)
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_aspect('equal', 'box')
plt.title("Earth, Moon, and Lagrange Point L2")
plt.legend()
plt.show()
