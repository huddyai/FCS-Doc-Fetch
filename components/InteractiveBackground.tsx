import React, { useRef, useEffect } from 'react';

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let leaves: Leaf[] = [];
    
    // Mouse state for wind interaction
    let mouseX = -1000;
    let mouseY = -1000;
    let mouseVx = 0; // Mouse velocity x

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initLeaves();
    };

    class Leaf {
      x: number;
      y: number;
      vx: number; // Horizontal drift velocity (wind)
      vy: number; // Falling speed
      size: number;
      angle: number;
      spinSpeed: number;
      oscillationSpeed: number;
      oscillationAmp: number;
      timeOffset: number;
      color: string;
      type: number; // 0 for simple oval, 1 for pointed leaf

      constructor(resetY = false) {
        this.x = Math.random() * canvas.width;
        // If resetY is true, start at top (for respawning), else random height (initial load)
        this.y = resetY ? -20 : Math.random() * canvas.height;
        
        this.vx = 0;
        this.vy = Math.random() * 0.5 + 0.3; // Slow falling speed
        this.size = Math.random() * 6 + 6;
        
        this.angle = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.02;
        
        // Swaying motion parameters
        this.oscillationSpeed = Math.random() * 0.02 + 0.01;
        this.oscillationAmp = Math.random() * 50 + 20;
        this.timeOffset = Math.random() * 1000;
        
        this.type = Math.random() > 0.5 ? 0 : 1;

        // FCS Brand Colors: Mostly Green (#92C973), some Navy (#2d475c), some light variations
        const rand = Math.random();
        if (rand > 0.6) {
          // FCS Green
          this.color = `rgba(146, 201, 115, ${Math.random() * 0.4 + 0.2})`;
        } else if (rand > 0.3) {
          // Lighter Green
          this.color = `rgba(175, 220, 150, ${Math.random() * 0.4 + 0.1})`;
        } else {
          // Navy / Greyish (Subtle shadow leaves)
          this.color = `rgba(45, 71, 92, ${Math.random() * 0.15 + 0.05})`;
        }
      }

      update(time: number) {
        // Natural swaying motion
        const sway = Math.sin(time * this.oscillationSpeed + this.timeOffset) * 0.5;
        
        this.x += sway + this.vx;
        this.y += this.vy;
        this.angle += this.spinSpeed;

        // Apply drag to wind velocity (vx) to return to normal falling
        this.vx *= 0.95;

        // Mouse interaction (Wind)
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
           // Push leaves away slightly if mouse is close
           const force = (maxDist - dist) / maxDist;
           // If mouse is moving fast horizontally, add that to wind
           this.vx += (dx / dist) * force * -0.5 + (mouseVx * 0.05 * force);
           this.y += (dy / dist) * force * 0.5; // Slight vertical push
           this.spinSpeed += 0.001; // Spin faster in turbulence
        }

        // Reset if off screen (bottom or sides too far)
        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }

      reset() {
        this.y = -20;
        this.x = Math.random() * canvas.width;
        this.vx = 0;
        this.vy = Math.random() * 0.5 + 0.3;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        if (this.type === 0) {
          // Simple Oval Leaf
          ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        } else {
          // Pointed Leaf (simple almond shape)
          ctx.moveTo(-this.size, 0);
          ctx.bezierCurveTo(-this.size / 2, -this.size / 2, this.size / 2, -this.size / 2, this.size, 0);
          ctx.bezierCurveTo(this.size / 2, this.size / 2, -this.size / 2, this.size / 2, -this.size, 0);
        }
        ctx.fill();
        ctx.restore();
      }
    }

    const initLeaves = () => {
      leaves = [];
      const area = canvas.width * canvas.height;
      // Density reduced: was 12000, now 24000 to halve the count
      const count = Math.floor(area / 24000); 
      for (let i = 0; i < count; i++) {
        leaves.push(new Leaf());
      }
    };

    let time = 0;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time++;
      leaves.forEach(leaf => {
        leaf.update(time);
        leaf.draw();
      });
      
      // Decay mouse velocity
      mouseVx *= 0.9;
      
      animationFrameId = requestAnimationFrame(animate);
    };

    let lastMouseX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      
      // Calculate simplistic mouse velocity
      mouseVx = e.clientX - lastMouseX;
      lastMouseX = e.clientX;
    };
    
    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};