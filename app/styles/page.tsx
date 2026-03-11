import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function StylesPage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
        <p className="text-muted-foreground">
          A comprehensive overview of PathTwoFI's design system, including colors, typography, and components.
        </p>
      </div>

      <Separator />

      {/* Color Palette Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Color Palette</h2>
          <p className="text-muted-foreground">Our color system supports both light and dark themes.</p>
        </div>

        {/* Primary Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Primary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Background" className="bg-background border" textColor="text-foreground" />
            <ColorSwatch name="Foreground" className="bg-foreground" textColor="text-background" />
            <ColorSwatch name="Primary" className="bg-primary" textColor="text-primary-foreground" />
            <ColorSwatch name="Primary Foreground" className="bg-primary-foreground border" textColor="text-primary" />
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Secondary Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Secondary" className="bg-secondary" textColor="text-secondary-foreground" />
            <ColorSwatch name="Secondary Foreground" className="bg-secondary-foreground" textColor="text-secondary" />
            <ColorSwatch name="Muted" className="bg-muted" textColor="text-muted-foreground" />
            <ColorSwatch name="Muted Foreground" className="bg-muted-foreground" textColor="text-muted" />
          </div>
        </div>

        {/* Accent Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Accent Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Accent" className="bg-accent" textColor="text-accent-foreground" />
            <ColorSwatch name="Accent Foreground" className="bg-accent-foreground" textColor="text-accent" />
            <ColorSwatch name="Destructive" className="bg-destructive" textColor="text-destructive-foreground" />
            <ColorSwatch name="Destructive Foreground" className="bg-destructive-foreground border" textColor="text-destructive" />
          </div>
        </div>

        {/* UI Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">UI Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Card" className="bg-card border" textColor="text-card-foreground" />
            <ColorSwatch name="Card Foreground" className="bg-card-foreground" textColor="text-card" />
            <ColorSwatch name="Popover" className="bg-popover border" textColor="text-popover-foreground" />
            <ColorSwatch name="Popover Foreground" className="bg-popover-foreground" textColor="text-popover" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Border" className="bg-border" textColor="text-foreground" />
            <ColorSwatch name="Input" className="bg-input" textColor="text-foreground" />
            <ColorSwatch name="Ring" className="bg-ring" textColor="text-background" />
          </div>
        </div>

        {/* Chart Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Chart Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ColorSwatch name="Chart 1" className="bg-chart-1" textColor="text-white" />
            <ColorSwatch name="Chart 2" className="bg-chart-2" textColor="text-white" />
            <ColorSwatch name="Chart 3" className="bg-chart-3" textColor="text-white" />
            <ColorSwatch name="Chart 4" className="bg-chart-4" textColor="text-white" />
            <ColorSwatch name="Chart 5" className="bg-chart-5" textColor="text-white" />
          </div>
        </div>

        {/* Sidebar Colors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sidebar Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Sidebar" className="bg-sidebar" textColor="text-sidebar-foreground" />
            <ColorSwatch name="Sidebar Foreground" className="bg-sidebar-foreground" textColor="text-sidebar" />
            <ColorSwatch name="Sidebar Primary" className="bg-sidebar-primary" textColor="text-sidebar-primary-foreground" />
            <ColorSwatch name="Sidebar Primary FG" className="bg-sidebar-primary-foreground border" textColor="text-sidebar-primary" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Sidebar Accent" className="bg-sidebar-accent" textColor="text-sidebar-accent-foreground" />
            <ColorSwatch name="Sidebar Accent FG" className="bg-sidebar-accent-foreground" textColor="text-sidebar-accent" />
            <ColorSwatch name="Sidebar Border" className="bg-sidebar-border" textColor="text-foreground" />
            <ColorSwatch name="Sidebar Ring" className="bg-sidebar-ring" textColor="text-background" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Typography Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Typography</h2>
          <p className="text-muted-foreground">
            We use Inter as our primary font family.
          </p>
        </div>

        {/* Font Families */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Font Families</h3>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Sans (Primary)</p>
                <p className="text-2xl font-sans">The quick brown fox jumps over the lazy dog</p>
                <p className="text-sm text-muted-foreground">font-family: Inter</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heading Styles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Headings</h3>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
                <p className="text-sm text-muted-foreground font-mono">text-4xl font-bold tracking-tight</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Heading 2</h2>
                <p className="text-sm text-muted-foreground font-mono">text-3xl font-bold tracking-tight</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Heading 3</h3>
                <p className="text-sm text-muted-foreground font-mono">text-2xl font-semibold</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">Heading 4</h4>
                <p className="text-sm text-muted-foreground font-mono">text-xl font-semibold</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h5 className="text-lg font-semibold">Heading 5</h5>
                <p className="text-sm text-muted-foreground font-mono">text-lg font-semibold</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h6 className="text-base font-semibold">Heading 6</h6>
                <p className="text-sm text-muted-foreground font-mono">text-base font-semibold</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Body Text Styles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Body Text</h3>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xl">Extra Large Body Text</p>
                <p className="text-sm text-muted-foreground font-mono">text-xl</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-lg">Large Body Text</p>
                <p className="text-sm text-muted-foreground font-mono">text-lg</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-base">Base Body Text (Default)</p>
                <p className="text-sm text-muted-foreground font-mono">text-base</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm">Small Body Text</p>
                <p className="text-sm text-muted-foreground font-mono">text-sm</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs">Extra Small Body Text</p>
                <p className="text-sm text-muted-foreground font-mono">text-xs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Font Weights */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Font Weights</h3>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <p className="text-lg font-light">Light Weight Text</p>
                <p className="text-sm text-muted-foreground font-mono">font-light (300)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-lg font-normal">Normal Weight Text</p>
                <p className="text-sm text-muted-foreground font-mono">font-normal (400)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-lg font-medium">Medium Weight Text</p>
                <p className="text-sm text-muted-foreground font-mono">font-medium (500)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-lg font-semibold">Semibold Weight Text</p>
                <p className="text-sm text-muted-foreground font-mono">font-semibold (600)</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-lg font-bold">Bold Weight Text</p>
                <p className="text-sm text-muted-foreground font-mono">font-bold (700)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Text Styles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Special Text Styles</h3>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">Muted Text</p>
                <p className="text-sm text-muted-foreground font-mono">text-muted-foreground</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="italic">Italic Text</p>
                <p className="text-sm text-muted-foreground font-mono">italic</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="underline">Underlined Text</p>
                <p className="text-sm text-muted-foreground font-mono">underline</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="line-through">Strikethrough Text</p>
                <p className="text-sm text-muted-foreground font-mono">line-through</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="tracking-tight">Tight Tracking</p>
                <p className="text-sm text-muted-foreground font-mono">tracking-tight</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="tracking-wide">Wide Tracking</p>
                <p className="text-sm text-muted-foreground font-mono">tracking-wide</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="leading-tight">
                  Tight leading text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm text-muted-foreground font-mono">leading-tight</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="leading-relaxed">
                  Relaxed leading text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm text-muted-foreground font-mono">leading-relaxed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Styles */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Code & Monospace</h3>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <p>
                  Inline code: <code className="text-sm bg-muted px-1.5 py-0.5 rounded">const greeting = "Hello World";</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  &lt;code className="text-sm bg-muted px-1.5 py-0.5 rounded"&gt;
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
{`function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
}`}
                </pre>
                <p className="text-sm text-muted-foreground">
                  &lt;pre className="text-sm bg-muted p-4 rounded-lg"&gt;
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Component Examples */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Component Examples</h2>
          <p className="text-muted-foreground">Common UI components using our design system.</p>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Buttons</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <Separator className="my-4" />
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎨</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Badges</h3>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Cards</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area. It can contain any content.</p>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Highlighted Card</CardTitle>
                <CardDescription>With custom border color</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards can be customized with different border colors and styles.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Border Radius */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Border Radius</h2>
          <p className="text-muted-foreground">Our border radius system for consistent rounded corners.</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary" style={{ borderRadius: 'var(--radius-sm)' }}></div>
                <p className="text-sm font-medium">Small</p>
                <p className="text-xs text-muted-foreground">calc(var(--radius) - 4px)</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary" style={{ borderRadius: 'var(--radius-md)' }}></div>
                <p className="text-sm font-medium">Medium</p>
                <p className="text-xs text-muted-foreground">calc(var(--radius) - 2px)</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary" style={{ borderRadius: 'var(--radius-lg)' }}></div>
                <p className="text-sm font-medium">Large</p>
                <p className="text-xs text-muted-foreground">var(--radius) = 0.625rem</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-20 bg-primary" style={{ borderRadius: 'var(--radius-xl)' }}></div>
                <p className="text-sm font-medium">Extra Large</p>
                <p className="text-xs text-muted-foreground">calc(var(--radius) + 4px)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spacing */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Spacing Scale</h2>
          <p className="text-muted-foreground">Consistent spacing values used throughout the application.</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            {[
              { value: '1', rem: '0.25rem', px: '4px' },
              { value: '2', rem: '0.5rem', px: '8px' },
              { value: '3', rem: '0.75rem', px: '12px' },
              { value: '4', rem: '1rem', px: '16px' },
              { value: '6', rem: '1.5rem', px: '24px' },
              { value: '8', rem: '2rem', px: '32px' },
              { value: '10', rem: '2.5rem', px: '40px' },
              { value: '12', rem: '3rem', px: '48px' },
            ].map((space) => (
              <div key={space.value} className="flex items-center gap-4">
                <div className="w-20 text-sm font-mono text-muted-foreground">{space.value}</div>
                <div className="h-8 bg-primary" style={{ width: space.rem }}></div>
                <div className="text-sm text-muted-foreground">
                  {space.rem} ({space.px})
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
  className: string;
  textColor?: string;
}

function ColorSwatch({ name, className, textColor = "text-white" }: ColorSwatchProps) {
  return (
    <div className={`rounded-lg p-6 ${className}`}>
      <p className={`text-sm font-medium ${textColor}`}>{name}</p>
    </div>
  );
}
