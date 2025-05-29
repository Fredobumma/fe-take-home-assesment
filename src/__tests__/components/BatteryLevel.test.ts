import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BatteryLevel from '../../components/BatteryLevel.vue';

describe('BatteryLevel', () => {
  it('renders correct percentage', () => {
    const wrapper = mount(BatteryLevel, {
      props: {
        level: 0.75
      }
    });
    expect(wrapper.text()).toContain('75%');
  });

  it('applies correct color class for low battery', () => {
    const wrapper = mount(BatteryLevel, {
      props: {
        level: 0.15
      }
    });
    const fill = wrapper.find('.bg-red-500');
    expect(fill.exists()).toBe(true);
  });

  it('applies correct color class for medium battery', () => {
    const wrapper = mount(BatteryLevel, {
      props: {
        level: 0.35
      }
    });
    const fill = wrapper.find('.bg-amber-500');
    expect(fill.exists()).toBe(true);
  });

  it('applies correct color class for high battery', () => {
    const wrapper = mount(BatteryLevel, {
      props: {
        level: 0.85
      }
    });
    const fill = wrapper.find('.bg-emerald-500');
    expect(fill.exists()).toBe(true);
  });
});