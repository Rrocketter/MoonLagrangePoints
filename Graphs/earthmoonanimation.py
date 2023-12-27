import tkinter as tk
from PIL import Image, ImageTk
import math

class SolarSystemAnimation:
    def __init__(self, root):
        self.root = root
        self.root.title("Solar System Animation")

        self.canvas = tk.Canvas(root, width=600, height=600, bg="black")
        self.canvas.pack()

        # Load Earth image
        earth_image = Image.open("earth_image.png")  # Replace with the path to your Earth image
        earth_image = earth_image.resize((100, 100))
        self.earth_image = ImageTk.PhotoImage(earth_image.rotate(-23.4))

        # Create Earth with the loaded image
        self.earth = self.canvas.create_image(300, 300, image=self.earth_image)

        # Create Moon as before
        self.moon = self.canvas.create_oval(0, 0, 20, 20, fill="gray")

        self.animation()

    def animation(self):
        self.angle = 0
        self.animate()

    def animate(self):
        x = 300 + 100 * math.cos(math.radians(self.angle))
        y = 300 + 100 * math.sin(math.radians(self.angle))

        self.canvas.coords(self.moon, x, y, x + 20, y + 20)

        self.angle += 1  # Increase the angle for the next frame

        # Repeat the animation
        self.root.after(10, self.animate)

if __name__ == "__main__":
    root = tk.Tk()
    app = SolarSystemAnimation(root)
    root.mainloop()
