import numpy as np

G = 6.67e-11  # N * m^2 / kg^2
M_earth = 5.97e24  # Mass of Earth in kg
M_moon = 7.35e22  # Mass of Moon in kg
R_earth_moon = 3.84e8  # Distance between Earth and Moon in meters

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

# Example values
moonlet_mass_values = [1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16, 1e17, 1e18, 5e18, 1e19, 5e19]

for moonlet_mass in moonlet_mass_values:
    # Calculate orbital parameters at Lagrange point L4
    angular_velocity, period, speed, x_l4, y_l4 = calculate_orbital_parameters_l4(moonlet_mass, R_earth_moon)

    print(f"\nMoonlet Mass: {moonlet_mass} kg")
    print(f"Lagrange Point L4 Location: ({x_l4}, {y_l4}) meters")
    print(f"Angular Velocity (w) at Lagrange Point L4: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L4: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L4: {speed} m/s")

print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")
print("----------------------------------------")

moonlet_mass_1 = 1e18
for distance_earth_moon in np.arange(3.84e8, 4.84e8, 1e6):
    # Calculate orbital parameters at Lagrange point L4
    angular_velocity, period, speed, x_l4, y_l4 = calculate_orbital_parameters_l4(moonlet_mass_1, distance_earth_moon)

    print(f"\nDistance Between Earth and Moon: {distance_earth_moon} meters")
    print(f"Lagrange Point L4 Location: ({x_l4}, {y_l4}) meters")
    print(f"Angular Velocity (w) at Lagrange Point L4: {angular_velocity} rad/s")
    print(f"Orbital Period at Lagrange Point L4: {period} seconds")
    print(f"Orbital Speed at Lagrange Point L4: {speed} m/s")
