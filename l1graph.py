import numpy as np
import matplotlib.pyplot as plt

# Constants
G = 6.67e-11
M_earth = 5.97e24
M_moon = 7.35e22
R_earth_moon = 3.84e8

# Function to calculate Lagrange point L1
def lagrange_point_l1(moonlet_mass, distance_earth_moon):
    r_l1 = distance_earth_moon * (M_earth / (3 * (M_earth + moonlet_mass)))**(1/3)
    return r_l1

# Function to calculate orbital parameters at Lagrange point L1
def calculate_orbital_parameters(moonlet_mass, distance_earth_moon):
    r_l1 = lagrange_point_l1(moonlet_mass, distance_earth_moon)
    omega = np.sqrt(G * (M_earth + moonlet_mass) / r_l1**3)
    orbital_period = 2 * np.pi / omega
    orbital_speed = omega * r_l1
    return omega, orbital_period, orbital_speed, r_l1

# Example values
moonlet_mass = 1e18

# Calculate orbital parameters at Lagrange point L1
angular_velocity, period, speed, r_l1 = calculate_orbital_parameters(moonlet_mass, R_earth_moon)

# Plotting
fig, ax = plt.subplots(figsize=(10, 10))

# Plot the Earth (scaled down for better visualization)
earth_circle = plt.Circle((0, 0), R_earth_moon / (5 * (1 + M_moon/M_earth)), color='blue', label='Earth')
ax.add_patch(earth_circle)

# Plot the Moon
moon_circle = plt.Circle((R_earth_moon, 0), R_earth_moon / (1 + M_earth/M_moon), color='gray', label='Moon')
ax.add_patch(moon_circle)

# Plot the Lagrange point L1 (slightly bigger for better visibility)
l1_point = plt.Circle((r_l1, 0), 2e6, color='red', label='L1 Point')  # Increased the size of L1 Point
ax.add_patch(l1_point)

# Plot the moonlet orbiting around L1 (made smaller for better visual distinction)
moonlet_x = r_l1 * np.cos(0)
moonlet_y = r_l1 * np.sin(0)
moonlet = plt.Circle((moonlet_x, moonlet_y), 5e5, color='green', label='Moonlet')  # Adjusted the size of Moonlet
ax.add_patch(moonlet)

ax.set_xlim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)
ax.set_ylim(-1.5 * R_earth_moon, 1.5 * R_earth_moon)
ax.set_aspect('equal', 'box')
plt.title("Earth, Moon, Lagrange Point L1, and Moonlet")
plt.legend()
plt.show()
