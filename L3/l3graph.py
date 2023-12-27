import numpy as np
import matplotlib.pyplot as plt

G = 6.67e-11  # Gravitational constant in N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters
standard_moonlet_mass = 1e18

# Function to calculate Lagrange point L3
def lagrange_point_l3(moonlet_mass, distance_earth_moon):
    r_l3 = -distance_earth_moon * ((M_earth + moonlet_mass) / (3 * M_moon)) ** (1 / 3)
    return r_l3

# Function to calculate orbital parameters at Lagrange point L3
def calculate_orbital_parameters_l3(moonlet_mass, distance_earth_moon):
    r_l3 = lagrange_point_l3(moonlet_mass, distance_earth_moon)

    # Check for potential negative values before calculating square root
    if r_l3 < 0:
        omega = np.nan  # Set omega to NaN (Not a Number) for invalid cases
    else:
        omega = np.sqrt(G * (M_moon + moonlet_mass) / r_l3 ** 3)  # Angular velocity

    orbital_period = 2 * np.pi / omega if not np.isnan(omega) else np.nan  # Orbital period
    orbital_speed = omega * r_l3 if not np.isnan(omega) else np.nan  # Orbital speed

    return omega, orbital_period, orbital_speed, r_l3

# Plotting
fig, ax = plt.subplots(figsize=(12, 12))  # Adjust the figure size

# Plot the Earth
earth_circle = plt.Circle((0, 0), 0.1 * R_earth_moon, color='blue', label='Earth')
ax.add_patch(earth_circle)

# Plot the Moon
moon_circle = plt.Circle((R_earth_moon, 0), 0.05 * R_earth_moon, color='gray', label='Moon')
ax.add_patch(moon_circle)

# Calculate orbital parameters at Lagrange point L3
angular_velocity, period, speed, l3 = calculate_orbital_parameters_l3(standard_moonlet_mass, R_earth_moon)

# Plot Lagrange Point L3 with a larger size
l3_point_size = 8e6  # Corrected x-coordinate
l3_point = plt.Circle((l3, 0), l3_point_size, color='red', label=f'L3 Point, Mass={standard_moonlet_mass} kg')
ax.add_patch(l3_point)


# Set labels and legend
ax.set_xlim(-7.5 * R_earth_moon, 7.5 * R_earth_moon)  # Adjust the x-axis limits
ax.set_ylim(-5.5 * R_earth_moon, 5.5 * R_earth_moon)
ax.set_xlabel('X Position (m)')
ax.set_ylabel('Y Position (m)')
ax.set_aspect('equal', 'box')
plt.title("Earth, Moon, and Lagrange Point L3")
plt.legend()
plt.show()
